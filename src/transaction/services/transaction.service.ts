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

  flattenChildren(children: TransactionDto[]) {
    const flatternedArray: TransactionDto[] = [];
    this.iterator(children, flatternedArray);
    return flatternedArray;
  }

  iterator(array: TransactionDto[], result: TransactionDto[]) {
    array.map((item) => {
      const clone = Object.assign({}, item);
      // delete the child
      if (clone.children) delete clone.children;

      result.push(clone);
      // iterate over children
      if (item.children) this.iterator(item.children, result);
    });
  }

  filterChildrenByConfidenceLevel(
    children: TransactionDto[],
    confidenceLevel: number,
    parent: CombinedConnectionInfoDto,
  ) {
    children.map((child, index, array) => {
      if (
        child.connectionInfo &&
        child.connectionInfo.confidence >= confidenceLevel
      ) {
        this.computeCombinedConnectionInfo(parent, child);

        return {
          ...child,
          children: child.children
            ? this.filterChildrenByConfidenceLevel(
                child.children,
                confidenceLevel,
                child.CombinedConnectionInfo,
              )
            : [],
        };
      }
      // ignore other records
      array.splice(index);
    });
    return children;
  }

  computeCombinedConnectionInfo(
    parent: CombinedConnectionInfoDto,
    transaction: TransactionDto,
  ) {
    transaction.CombinedConnectionInfo = {
      // add unique types
      type: [...new Set([...parent.type, transaction.connectionInfo.type])],
      confidence: transaction.connectionInfo.confidence * parent.confidence,
    };
  }

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
      transaction.connectionInfo.confidence < confidenceLevel
    ) {
      return null;
    }

    // set combined confidence level
    if (transaction.connectionInfo) {
      transaction.CombinedConnectionInfo = {
        type: [transaction.connectionInfo.type],
        confidence: transaction.connectionInfo.confidence,
      };
    } else {
      // set the default for the parent
      transaction.CombinedConnectionInfo = {
        type: [],
        confidence: 1,
      };
    }

    // filter children
    transaction.children = transaction.children
      ? this.filterChildrenByConfidenceLevel(
          transaction.children,
          confidenceLevel,
          transaction.CombinedConnectionInfo,
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
