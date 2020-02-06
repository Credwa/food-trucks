import { Injectable } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Injectable()
export class JobService {

    constructor(scrapperService: ScrapperService) { this.startCron() }

    startCron(): void {
        const scrapper = new ScrapperService();
        scrapper.initRepeatRequests();
        // setInterval(() => {
        //     test.makeRequests();
        // }, 5000);
    }
}
