var result = 'x ';
for (var i = 0; i < 11; i++) {

    for (var j = 0; j < 11; j++) {

        if (i == 0 && j > 0) {
            result += '[' + j + ']';
        } else if (j == 0 && i > 0) {
            result += '[' + i + '] ';
        } else if (i > 0 && j > 0) {
            result += (i * j) + ' ';
        }
    }
    result += '\n'
}

console.log(result);


// var i, j, result;
// console.log("Multiplication table\n\n");
// // printf("Here multiplication table\n\n");
// for (i = 1; i <= 10; i++) {
//     for (j = 1; j <= 10; j++) {

//         result = i * j;

//         console.log(result + "\t");
//     }
// }
// console.log("\n");