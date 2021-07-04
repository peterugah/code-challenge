import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { TransactionDto } from './transaction.dto';
@Injectable()
export class TransactionService {
  private readonly dataPath: string = 'data/test-data_072020.json';

  getMatchingData(query: TransactionDto) {
    const data = this.getJsonData();
    const { transactionId, confidenceLevel } = query;
    // loop through the array to get the record with the id
    const result = this.getTransaction(transactionId, confidenceLevel, data);
    if (!result) {
      throw new NotFoundException('transaction not found');
    }
    return result;
    // get all its children with the confidence level greater than or equal to that provided

    // perform data transformation

    // flatten data
    return data;
  }

  // private getTransaction(id: string, data: object[]) {
  //   for (let transaction of data) {
  //     console.log(transaction['id']);
  //     if (transaction['id'] === id) return transaction;
  //     if (transaction['children']) {
  //       return this.getTransaction(id, transaction['children']);
  //     }
  //   }
  // }

  private getTransaction(id: string, confidenceLevel: number, data: object[]) {
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

  private getJsonData() {
    const transctionDir = __dirname.split('/');
    transctionDir.length = transctionDir.length - 1;
    const fullPath = `${transctionDir.join('/')}/${this.dataPath}`;
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('unabled to locate json data');
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  getData() {
    return this.getJsonData();
  }
}
