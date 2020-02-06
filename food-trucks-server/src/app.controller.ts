import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { JobService } from './services/job.service';

@Controller()
export class AppController {

    constructor(private readonly appService: AppService, private readonly jobService: JobService) {}

    @Get()
    getHello(): object {
        return this.appService.getHello();
    }
}
