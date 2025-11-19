import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IntegrationConfigService } from './integration-config.service';
import { UpdateIntegrationConfigDto } from './dto/update-integration-config.dto';

@ApiTags('Integrations')
@Controller('integrations/config')
export class IntegrationConfigController {
  constructor(private readonly integrationConfigService: IntegrationConfigService) {}

  @Get()
  getConfig(@CurrentUser('sub') userId: string) {
    return this.integrationConfigService.getConfig(userId);
  }

  @Put()
  updateConfig(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateIntegrationConfigDto,
  ) {
    return this.integrationConfigService.upsert(userId, dto);
  }
}
