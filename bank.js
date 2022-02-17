let bank = [];

async function getExchangeRates() {
  let result = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    .then(res => res.json())
    .then(data => {
      let  rates = {};
      data.forEach(item => {
        rates[item.ccy] = item;
      })
      return rates;
    })
    .catch(() => {
      throw new Error(`Could not fetch , status: ${result.status}`);
    })

  return result;
}
// let a = getExchangeRates()
// console.log(a)
class Customer {
  fullName;
  isActive;
  dateReg;
  debitAccount;
  creditAccount;

  constructor(fullName, isActive, dateReg) {
    this.fullName = fullName;
    this.isActive = isActive;
    this.dateReg = dateReg;
    this.debitAccount = [];
    this.creditAccount = [];
  }

  setDebitAccount (date, balance, currency) {
    this.debitAccount.push({
      currency : currency,
      balance  : balance,
      dateEndActive : date,
    });
  }

  setCreditAccount (date, balance, limit, currency) {
    this.creditAccount.push({
      currency : currency,
      balance : balance,
      limit : limit,
      dateEndActive : date,
    });
  }
}

let customerOne = new Customer('vasya', true, '12.09.2021');
let customerTwo = new Customer('petya', true, '12.09.2021');
let customerThree = new Customer('valya', false, '12.09.2021');
let customerFour = new Customer('masha', true, '12.09.2021');
let customerFive = new Customer('olya', false, '12.09.2021');

customerOne.setDebitAccount('25.12.2023', 500, "UAH");
customerOne.setDebitAccount('25.12.2023', 500, "UAH");
customerOne.setDebitAccount('25.12.2023', 500, "UAH");

customerTwo.setDebitAccount('25.12.2023', 5000, "RUR");
customerTwo.setDebitAccount('25.12.2023', 6000, "RUR");
customerTwo.setCreditAccount('25.12.2023', 400, 500, "USD");
customerTwo.setCreditAccount('25.12.2023', 300, 500, "RUR");
customerTwo.setCreditAccount('25.12.2023', 200, 500, "EUR");
customerTwo.setCreditAccount('25.12.2023', 100, 500, 'USD');

customerThree.setDebitAccount('25.12.2023', 500, "USA");
customerThree.setCreditAccount('25.12.2023', 250, 500, "UAH");
customerThree.setCreditAccount('25.12.2023', 150, 200, "UAH");
customerThree.setCreditAccount('25.12.2023', 250, 500, "UAH");

customerFour.setDebitAccount('25.12.2023', 500, "EUR");
customerFour.setCreditAccount('25.12.2023', 150, 200, "USD");

customerFive.setDebitAccount('25.12.2023', 500, "EUR");

bank.push(customerOne, customerTwo, customerThree, customerFour, customerFive);

let creditDutyAllCustomers = async function() {
  let duty = 0;

  await getExchangeRates()
    .then(rates => {
      bank.forEach((item => {
        if (item.creditAccount.length) {
          item.creditAccount.forEach(item => {
            if (item.limit > item.balance) {
              if (item.currency === "UAH") {
                duty += (item.limit - item.balance) / rates.USD.sale;
              } else if (item.currency === "RUR") {
                duty += (item.limit - item.balance) * rates.RUR.sale / rates.USD.sale;
              } else if (item.currency === "EUR") {
                duty += (item.limit - item.balance) * rates.EUR.sale / rates.USD.sale;
              } else {
                duty += (item.limit - item.balance);
              }
            }
          })
        }
      }))
    });

  return duty;
};

let totalFunds = async function() {
  let cash = 0;

  await getExchangeRates()
    .then(rates => {
      bank.forEach((customer => {
        if (customer.debitAccount.length) {
          customer.debitAccount.forEach(item => {
            if (item.currency === "UAH") {
              cash += item.balance / rates.USD.sale;
            } else if (item.currency === "RUR") {
              cash += item.balance * rates.RUR.sale / rates.USD.sale;
            } else if (item.currency === "EUR") {
              cash += item.balance * rates.EUR.sale / rates.USD.sale;
            } else {
              cash +=  item.balance;
            }
          })
        }

        if (customer.creditAccount.length) {
          customer.creditAccount.forEach(item => {
            if (item.limit < item.balance) {
              if (item.currency === "UAH") {
                cash += (item.limit - item.balance) / rates.USD.sale;
              } else if (item.currency === "RUR") {
                cash += (item.limit - item.balance) * rates.RUR.sale / rates.USD.sale;
              } else if (item.currency === "EUR") {
                cash += (item.limit - item.balance) * rates.EUR.sale / rates.USD.sale;
              } else {
                cash += (item.limit - item.balance);
              }
            }
          })
        }
      }))
    });

  return cash;
};

let amountCustomersDebtors = function (status) {
  let amount = 0;

  bank.forEach(customer => {
    if (customer.isActive === status) {
      for (let i = 0; i < customer.creditAccount.length; i++) {
        if (customer.creditAccount[i].limit > customer.creditAccount[i].balance) {
          amount++;
          break;
        }
      }
    }
  })

  return amount;
};

let sumCreditDutyCustomers = async function (isActive) {
  let sum = 0;

  await getExchangeRates()
    .then(rates => {
      bank.forEach((customer => {
        if (customer.isActive === isActive && customer.creditAccount.length > 0) {
          customer.creditAccount.forEach(item => {
            if (item.limit > item.balance) {
              if (item.currency === "UAH") {
                sum += (item.limit - item.balance) / rates.USD.sale;
              } else if (item.currency === "RUR") {
                sum += (item.limit - item.balance) * rates.RUR.sale / rates.USD.sale;
              } else if (item.currency === "EUR") {
                sum += (item.limit - item.balance) * rates.EUR.sale / rates.USD.sale;
              } else {
                sum += (item.limit - item.balance);
              }
            }
          })
        }
      }))
    });

  return sum;
};

console.log(sumCreditDutyCustomers(false));

