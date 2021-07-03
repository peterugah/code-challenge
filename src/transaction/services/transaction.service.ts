import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class TransactionService {
  getJsonData() {
    const transctionDir = __dirname.split('/');
    transctionDir.length = transctionDir.length - 1;
    const fullPath = `${transctionDir.join('/')}/data/test-data_072020.json`;
    // return fullPath;
    return fs.existsSync(fullPath);
  }
}
