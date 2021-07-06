let refresh = 3600;
let now = new Date();
let file = '2021-07-05-12-58-00;3.7';

file = file.split(';')[0];
file = file.split('-');

let date = new Date(file[0],file[1]-1,file[2],file[3],file[4],file[5]);
console.log(date);
console.log(now);


let diff = now.getTime() - date.getTime();

console.log(diff/1000);