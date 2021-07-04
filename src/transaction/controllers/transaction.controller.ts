import { Get, NotFoundException, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JoiObjectPipe } from 'src/common/pipes/joi.pipe';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionService } from '../services/transaction.service';
import { transactionsValidator } from '../validators/transaction.validator';
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  getTransactions(
    @Query(new JoiObjectPipe(transactionsValidator)) query: TransactionDto,
  ) {
    const { transactionId, confidenceLevel } = query;

    const data = this.transactionService.getJsonData();

    const foundTransaction = this.transactionService.getTransaction(
      transactionId,
      confidenceLevel,
      data,
    );
    if (!foundTransaction) {
      throw new NotFoundException('transaction not found');
    }
    return foundTransaction;
    // compute combined confidence levels

    // flatten data
    return data;
  }

  @Get('data')
  data() {
    return this.transactionService.getData();
  }
}
