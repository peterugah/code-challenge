import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get('get-data')
  getData() {
    return this.transactionService.getJsonData();
    //   return projectDirectory + '/src/transaction/data/';
  }
}
