import { Get, NotFoundException, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JoiObjectPipe } from 'src/common/pipes/joi.pipe';
import { TransactionQueryDto } from '../dtos/transaction.dto';
import { TransactionService } from '../services/transaction.service';
import { transactionsValidator } from '../validators/transaction.validator';
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  getTransactions(
    @Query(new JoiObjectPipe(transactionsValidator)) query: TransactionQueryDto,
  ) {
    const { transactionId, confidenceLevel } = query;

    // get data
    const data = this.transactionService.getJsonData();

    // filter data
    const foundTransaction = this.transactionService.getTransaction(
      transactionId,
      confidenceLevel,
      data,
    );
    if (!foundTransaction) {
      throw new NotFoundException('transaction not found');
    }
    // filter out children with lower confidence levels

    // calculate combined connection  info

    // flatten data

    return foundTransaction;
    return data;
  }

  @Get('data')
  data() {
    return this.transactionService.getJsonData();
  }
}
