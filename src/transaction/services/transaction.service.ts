import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import {
  CombinedConnectionInfoDto,
  TransactionDto,
  TransactionQueryDto,
} from '../dtos/transaction.dto';
@Injectable()
export class TransactionService {
  private readonly dataPath: string = 'data/test-data_072020.json';

  flatternResult(data: TransactionDto) {
    return data;
  }

  filterChildrenByConfidenceLevel(
    children: TransactionDto[],
    confidenceLevel: number,
    parent: CombinedConnectionInfoDto,
  ) {
    if (!children) return [];
    //
    children.map((child, index, array) => {
      if (
        child.connectionInfo &&
        child.connectionInfo.confidence >= confidenceLevel
      ) {
        // set combined confidence levels
        if (parent) {
          child.CombinedConnectionInfoDto = {
            type: parent.type,
            confidence: parent.confidence,
          };
        }

        // only add child type and confidence if the type does not exists in parent
        this.computeCombinedConnectionInfo(parent, child);

        return {
          ...child,
          children: child.children
            ? this.filterChildrenByConfidenceLevel(
                child.children,
                confidenceLevel,
                parent,
              )
            : [],
        };
      }
      // remove the item not needed
      array.splice(index);
    });
    return children;
  }

  computeCombinedConnectionInfo(
    parent: CombinedConnectionInfoDto,
    transaction: TransactionDto,
  ) {
    let result: CombinedConnectionInfoDto;
    if (
      transaction.connectionInfo &&
      parent &&
      !parent.type.includes(transaction.connectionInfo.type)
    ) {
      transaction.CombinedConnectionInfoDto.type = [
        ...transaction.CombinedConnectionInfoDto.type,
        transaction.connectionInfo.type,
      ];
      transaction.CombinedConnectionInfoDto.confidence *=
        transaction.connectionInfo.confidence;
    } else {
      // use only the transaction type and confidence
      transaction.CombinedConnectionInfoDto = {
        type: [transaction.connectionInfo.type],
        confidence: transaction.connectionInfo.confidence,
      };
    }
  }
  getTransactions(
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
        return this.getTransactions(id, confidenceLevel, transaction.children);
      }
    }, null);
  }

  filterParentByConfidenceLevel(
    transaction: TransactionDto,
    confidenceLevel: number,
  ) {
    if (
      transaction.connectionInfo &&
      transaction.connectionInfo.confidence < confidenceLevel
    ) {
      return null;
    }

    // set combined confidence level
    if (transaction.connectionInfo) {
      transaction.CombinedConnectionInfoDto = {
        type: [transaction.connectionInfo.type],
        confidence: transaction.connectionInfo.confidence,
      };
    }
    // delete connection info of found transaction
    transaction.connectionInfo ? delete transaction.connectionInfo : null;

    // filter children
    transaction.children = transaction.children
      ? this.filterChildrenByConfidenceLevel(
          transaction.children,
          confidenceLevel,
          transaction.CombinedConnectionInfoDto,
        )
      : [];

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
