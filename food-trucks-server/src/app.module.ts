import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobService } from './services/job.service';
import { ScrapperService } from './services/scrapper.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, JobService, ScrapperService]
})
export class AppModule {}
