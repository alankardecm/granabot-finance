import { Module } from '@nestjs/common';
import { IntegrationsModule } from '../integrations/integrations.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [IntegrationsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
