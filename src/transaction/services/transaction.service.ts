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

  // TODO: filter children and return only transactions with same or higher confidence levels
  getTransaction(
    id: string,
    confidenceLevel: number,
    data: TransactionDto[],
  ): TransactionDto {
    return data.reduce((accumulator, transaction) => {
      if (accumulator) {
        return accumulator;
      }
      if (transaction.id === id) {
        return this.filterParentByConfidenceLevel(transaction, confidenceLevel);
      }
      if (transaction.children) {
        return this.getTransaction(id, confidenceLevel, transaction.children);
      }
    }, null);
  }

  filterParentByConfidenceLevel(
    transaction: TransactionDto,
    confidenceLevel: number,
  ) {
    if (
      transaction.connectionInfo &&
      transaction.connectionInfo.confidence > confidenceLevel
    ) {
      return null;
    }
    transaction.connectionInfo ? delete transaction.connectionInfo : null;
    return transaction;
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
