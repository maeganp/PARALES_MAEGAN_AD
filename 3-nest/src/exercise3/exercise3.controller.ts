import { Controller, Get, Param } from '@nestjs/common';

import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly e3: Exercise3Service) {}

    @Get("/helloWorld")
    getHello(): string {
        return this.e3.helloWorld();
    }

    @Get("/loopsTriangle/:height")
    loopsTriangle(@Param() height: string) {
        var parsedHeight = parseInt(height);
        this.e3.loopsTriangle(parsedHeight);
        return `type of height/parsedHeight ${parsedHeight} is ${typeof parsedHeight}`;
    }

    @Get("/primeNumber/:num")
    primeNumber(@Param('num') num: string) {
        var parsedNum = parseInt(num);
        return this.e3.primeNumber(parsedNum);
        //return `the number ${parsedNum} is ${this.e3.primeNumber(10)};
    }

}