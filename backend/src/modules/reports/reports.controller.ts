import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GenerateReportDto } from './dto/generate-report.dto';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('pdf')
  async downloadPdf(
    @CurrentUser('sub') userId: string,
    @Body() dto: GenerateReportDto,
    @Res() res: Response,
  ) {
    const { buffer, filename } = await this.reportsService.generatePdf(userId, dto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  }

  @Post('send-whatsapp')
  sendWhatsapp(@CurrentUser('sub') userId: string, @Body() dto: SendWhatsappDto) {
    return this.reportsService.sendWhatsappReport(userId, dto);
  }
}
