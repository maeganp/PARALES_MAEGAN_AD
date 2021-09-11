import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    helloWorld(){
        console.log("henlooo");
        return "henlo";
    }

    loopsTriangle(height:number){
        var i, j;

        for (i = 1; i <= height; i++) {
        for (j = 1; j <= i; j++) {
            console.log("*");
             }
            console.log("\n");
        }

    }

    primeNumber(num:number):string{

        var i = 1;
        var count = 0;

        for (i = 1; i <= num; i++) {
            if (num % i == 0)
        count++;
        }

        if (count == 2)
        return ("a prime number");
    }

}
