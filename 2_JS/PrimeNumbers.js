var num = 10;
var i = 1;
var count = 0;

for (i = 1; i <= num; i++) {
    if (num % i == 0)
        count++;
}

if (count == 2)
    console.log(num + " is a prime number");
console.log(num + " is not a prime number");