import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

    getHello(): object {
        return { test: 'Hello World!'};
    }
}
