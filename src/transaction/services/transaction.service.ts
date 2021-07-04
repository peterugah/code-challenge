import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { TransactionDto, TransactionQueryDto } from '../dtos/transaction.dto';
@Injectable()
export class TransactionService {
  private readonly dataPath: string = 'data/test-data_072020.json';

  getMatchingData(query: TransactionQueryDto) {
    const data = this.getJsonData();
    const { transactionId, confidenceLevel } = query;
    // loop through the array to get the record with that meet required conditions
    const result = this.getTransaction(transactionId, confidenceLevel, data);
    if (!result) {
      throw new NotFoundException('no transaction found');
    }
    return result;
    // compute combined confidence levels

    // flatten data
    return data;
  }

  // TODO: next steps
  flatternResult(data: TransactionDto) {
    if (data.children) {
      return data.children.reduce((accumulator, transaction) => {
        return {
          ...accumulator,
          ...transaction,
        };
      }, []);
    }
  }

  getTransaction(
    id: string,
    confidenceLevel: number,
    data: TransactionDto[],
  ): TransactionDto {
    return data.reduce((accumulator, transaction, index, array) => {
      if (accumulator) return accumulator;
      if (transaction.id === id) {
        // check for confidence level
        if (
          transaction.connectionInfo &&
          transaction.connectionInfo.confidence > confidenceLevel
        ) {
          return null;
        }
        // check if connectionInfo exists
        transaction.connectionInfo ? delete transaction.connectionInfo : null;
        // meets criteria
        return transaction;
      }
      if (transaction.children) {
        return this.getTransaction(id, confidenceLevel, transaction.children);
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
    return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as TransactionDto[];
  }
}
