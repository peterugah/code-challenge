import { Controller, Get, Query } from '@nestjs/common';
import { JoiObjectPipe } from 'src/pipes/joi.pipe';
import { detectFruadValidator } from 'src/validators/fruad.validator';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-validator')
  testValidator(
    @Query(new JoiObjectPipe(detectFruadValidator))
    query,
  ) {
    return query;
  }
}
