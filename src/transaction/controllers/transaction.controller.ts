import { Get, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JoiObjectPipe } from 'src/common/pipes/joi.pipe';
import { TransactionDto } from '../services/transaction.dto';
import { TransactionService } from '../services/transaction.service';
import { transactionsValidator } from '../validators/transaction.validator';
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  getTransactions(
    @Query(new JoiObjectPipe(transactionsValidator)) query: TransactionDto,
  ) {
    return this.transactionService.getMatchingData(query);
  }

  @Get('data')
  data() {
    return this.transactionService.getData();
  }
}
