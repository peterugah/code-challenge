import { Get, NotFoundException, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JoiObjectPipe } from 'src/common/pipes/joi.pipe';
import { TransactionDto, TransactionQueryDto } from '../dtos/transaction.dto';
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
    const foundTransaction = this.transactionService.getTransactions(
      transactionId,
      confidenceLevel,
      data,
    );
    if (!foundTransaction) {
      throw new NotFoundException('no matching transaction found');
    }
    // flatten data

    return this.transactionService.flatternResult(foundTransaction);

    return foundTransaction;
  }

  @Get('data')
  data() {
    return this.transactionService.getJsonData();
  }
}
