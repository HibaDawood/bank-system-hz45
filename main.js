#! /usr/bin/env node 
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
// Customer class definition
class Customer {
    // Properties
    fullName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    // Constructor
    constructor(fName, lName, age, gender, mob, acc) {
        this.fullName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// Bank class definition
class Bank {
    // Properties
    customer = [];
    account = [];
    // Methods
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transcation(accObj) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccounts, accObj];
    }
}
// Instantiate Bank object
let myBank = new Bank();
// Add customers and account numbers
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("female");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 25 * i, "female", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
// Display welcome message
console.log(chalk.bold.hex("#7cfc00")("=".repeat(60)));
console.log(chalk.bold.hex("#ffd700")(`\t   Wlecome To Hiba M.Dawood Bank-System`));
console.log(chalk.bold.hex("#7cfc00")("=".repeat(60)));
async function bankService(bank) {
    console.log(`Hint: Fisrt user account number is starting from 1001`);
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: chalk.bold.hex("#ff9966")("Please select the service\n"),
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: chalk.bold.rgb(255, 102, 178)("Please Enter your Account Number: "),
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.hex("#ff0000")("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(chalk.hex("#ffb6c1")(`Dear ${chalk.bold.italic.greenBright(name?.fullName)} ${name?.lastName} your account blanace is ${chalk.bold.italic.yellow(`$${account.balance}`)}\n`));
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: chalk.bold.rgb(255, 102, 178)("Please Enter your Account Number: "),
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.hex("#ff0000")("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: chalk.bold.hex("#90ee90")("Please Enter your amount:  $"),
                    name: "dollar",
                });
                if (ans.dollar > account.balance) {
                    console.log(chalk.bold.hex("#ff0000")(`Insufficient Balance...`));
                }
                let newBalance = account.balance - ans.dollar;
                bank.transcation({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: chalk.bold.rgb(255, 102, 178)("Please Enter your Account Number: "),
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.hex("#ff0000")("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: chalk.bold.italic.hex("#90ee90")("Please Enter your amount:  $"),
                    name: "dollar",
                });
                let newBalance = account.balance + ans.dollar;
                bank.transcation({ accNumber: account.accNumber, balance: newBalance });
                console.log(newBalance);
            }
        }
        if (service.select == "Exit") {
            return;
            break;
        }
    } while (true);
}
bankService(myBank);
