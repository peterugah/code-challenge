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
    // get json data
    const data = this.transactionService.getJsonData();

    // find matching transaction
    const foundTransaction = this.transactionService.getTransaction(
      transactionId,
      confidenceLevel,
      data,
    );
    if (!foundTransaction) {
      throw new NotFoundException('no matching transaction found');
    }
    // flatten children
    const flattenedResult = this.transactionService.flattenChildren(
      foundTransaction.children,
    );
    // remove unneeded properties in the first record
    delete foundTransaction.children;
    delete foundTransaction.connectionInfo;

    // put the first item back
    flattenedResult.unshift(foundTransaction);

    return flattenedResult;
  }
  // @Get('not-flattened')
  // data2(
  //   @Query(new JoiObjectPipe(transactionsValidator)) query: TransactionQueryDto,
  // ) {
  //   const { transactionId, confidenceLevel } = query;

  //   // get data
  //   const data = this.transactionService.getJsonData();

  //   // filter data
  //   const foundTransaction = this.transactionService.getTransaction(
  //     transactionId,
  //     confidenceLevel,
  //     data,
  //   );
  //   if (!foundTransaction) {
  //     throw new NotFoundException('no matching transaction found');
  //   }
  //   return foundTransaction;
  // }

  @Get('data')
  data() {
    return this.transactionService.getJsonData();
  }
}
