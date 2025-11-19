import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@CurrentUser('sub') userId: string, @Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(userId, query);
  }

  @Get('latest')
  latest(@CurrentUser('sub') userId: string) {
    return this.transactionsService.findLatest(userId);
  }

  @Get('overview')
  overview(@CurrentUser('sub') userId: string, @Query('accountId') accountId?: string) {
    return this.transactionsService.getMonthlyOverview(userId, accountId);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.transactionsService.remove(userId, id);
  }
}
