import { format } from "date-fns"

const arrowFunction = greeting => {
  return greeting
}

console.log(arrowFunction("hello from an arrow function"))
console.log(format(new Date(), "[Today is a] dddd"))
