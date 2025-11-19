import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponse, AuthTokens } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('E-mail ja cadastrado.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        telefone: dto.telefone,
        plano: dto.plano ?? 'starter',
        accounts: {
          create: {
            nome: dto.accountName ?? 'Carteira Principal',
            tipo: dto.accountType ?? 'pessoal',
            moeda: 'BRL',
          },
        },
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.nome, user.plano);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.mapUser(user),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const passwordMatches = await bcrypt.compare(dto.senha, user.senhaHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.nome, user.plano);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.mapUser(user),
    };
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(
        dto.refreshToken,
        { secret: this.getRefreshSecret() },
      );

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user?.hashedRefreshToken) {
        throw new UnauthorizedException('Token invalido.');
      }

      const tokenMatch = await bcrypt.compare(dto.refreshToken, user.hashedRefreshToken);
      if (!tokenMatch) {
        throw new UnauthorizedException('Token invalido.');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.nome, user.plano);
      await this.storeRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token invalido.');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      return { message: 'Se existir, enviaremos o e-mail com instrucoes.', previewToken: null };
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      message:
        'Token de redefinicao gerado. Configure o provedor de e-mail e envie utilizando o valor retornado.',
      previewToken: token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token invalido ou expirado.');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { senhaHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Senha atualizada com sucesso.' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    nome: string,
    plano: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email, nome, plano };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.getAccessSecret(),
        expiresIn: this.configService.get('JWT_TTL') ?? '15m',
      }),
      this.jwtService.signAsync({ sub: userId, email }, {
        secret: this.getRefreshSecret(),
        expiresIn: this.configService.get('JWT_REFRESH_TTL') ?? '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  private getAccessSecret() {
    return this.configService.get<string>('JWT_SECRET') ?? 'change-me';
  }

  private getRefreshSecret() {
    return this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'change-me-refresh';
  }

  private mapUser(user: { id: string; nome: string; email: string; plano: string }) {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
    };
  }
}
