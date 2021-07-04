import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { TransactionDto } from '../dtos/transaction.dto';
@Injectable()
export class TransactionService {
  private readonly dataPath: string = 'data/test-data_072020.json';

  getMatchingData(query: TransactionDto) {
    const data = this.getJsonData();
    const { transactionId, confidenceLevel } = query;
    // loop through the array to get the record with that meet required conditions
    const result = this.getTransaction(transactionId, confidenceLevel, data);
    if (!result) {
      throw new NotFoundException('transaction not found');
    }
    return result;
    // compute combined confidence levels

    // flatten data
    return data;
  }

  getTransaction(id: string, confidenceLevel: number, data: object[]) {
    return data.reduce((accumulator, transaction) => {
      console.log('accumulator is ', accumulator);
      if (accumulator) return accumulator;
      if (transaction['id'] === id) {
        // check for connectionInfo property
        transaction['connectionInfo'] &&
        confidenceLevel >= transaction['connectionInfo']['confidence']
          ? delete transaction['connectionInfo']
          : null;
        return transaction;
      }
      if (transaction['children']) {
        return this.getTransaction(
          id,
          confidenceLevel,
          transaction['children'],
        );
      }
    }, null);
  }

  getJsonData() {
    const transactionDir = __dirname.split('/');
    transactionDir.length = transactionDir.length - 1;
    const fullPath = `${transactionDir.join('/')}/${this.dataPath}`;
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('unabled to locate json data');
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  getData() {
    return this.getJsonData();
  }
}
