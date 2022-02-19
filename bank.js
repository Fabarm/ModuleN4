let bank = [];

async function getExchangeRates() {
  let result = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    .then(res => res.json())
    .then(data => {
      let  rates = {};
      data.forEach(item => {
        rates[item.ccy] = item;
      });
      rates["UAH"] = {
        sale : 1,
      };
      return rates;
    })
    .catch(() => {
      throw new Error(`Could not fetch , status: ${result.status}`);
    });

  return result;
}

class Customer {
  fullName;
  isActive;
  dateReg;
  codeId;
  debitAccount;
  creditAccount;

  constructor(fullName, codeId, isActive, dateReg) {
    this.fullName = fullName;
    this.codeId = codeId;
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

let customerOne = new Customer('vasya', 1234,  true, '12.09.2021');
let customerTwo = new Customer('petya', 1235,  true, '12.09.2021');
let customerThree = new Customer('valya', 1236,  false, '12.09.2021');
let customerFour = new Customer('masha', 1237,  true, '12.09.2021');
let customerFive = new Customer('olya', 1238,  false, '12.09.2021');

customerOne.setDebitAccount('25.12.2023', 500, "UAH");
customerOne.setDebitAccount('25.12.2023', 500, "UAH");
customerOne.setDebitAccount('25.12.2023', 500, "UAH");

customerTwo.setDebitAccount('25.12.2023', 5000, "RUR");
customerTwo.setDebitAccount('25.12.2023', 6000, "RUR");
customerTwo.setCreditAccount('25.12.2023', 400, 500, "USD");
customerTwo.setCreditAccount('25.12.2023', 300, 500, "RUR");
customerTwo.setCreditAccount('25.12.2023', 200, 500, "EUR");
customerTwo.setCreditAccount('25.12.2023', 100, 500, 'USD');

customerThree.setDebitAccount('25.12.2023', 500, "USD");
customerThree.setCreditAccount('25.12.2023', 250, 500, "UAH");
customerThree.setCreditAccount('25.12.2023', 150, 200, "UAH");
customerThree.setCreditAccount('25.12.2023', 250, 500, "UAH");

customerFour.setDebitAccount('25.12.2023', 500, "EUR");
customerFour.setCreditAccount('25.12.2023', 150, 200, "USD");

customerFive.setDebitAccount('25.12.2023', 500, "EUR");

bank.push(customerOne, customerTwo, customerThree, customerFour, customerFive);
console.log(bank)
let creditDutyAllCustomers = async function() {
  let duty = 0;

  await getExchangeRates()
    .then(rates => {
      bank.forEach((item => {
        if (item.creditAccount.length) {
          item.creditAccount.forEach(item => {
            if (item.limit > item.balance) {
              let temp = (item.limit - item.balance) / rates.USD.sale;
              duty += temp * rates[item.currency].sale;
            }
          });
        }
      }));
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
            let temp = item.balance / rates.USD.sale;
            cash += temp * rates[item.currency].sale;
          });
        }

        if (customer.creditAccount.length) {
          customer.creditAccount.forEach(item => {
            if (item.limit < item.balance) {
              let temp = (item.limit - item.balance) / rates.USD.sale;
              cash += temp * rates[item.currency].sale;
            }
          });
        }
      }));
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
  });

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
              let temp = (item.limit - item.balance) / rates.USD.sale;
              sum += temp * rates[item.currency].sale;
            }
          });
        }
      }));
    });

  return sum;
};

function pageHTML() {
  let container = document.createElement('div');
  container.className = 'container';
  let body = document.querySelector('body');
  body.append(container);
  let content = document.createElement('div');
  content.className = 'content';
  container.append(content);
  let customersList = document.createElement('div');
  customersList.className = 'customers_list';
  content.append(customersList);
  let header = document.createElement('h2');
  header.innerHTML = 'Customers';
  let divInner = document.createElement('div');
  divInner.className = 'customers_list_inner';
  customersList.append(header, divInner);
}
pageHTML();

function showCustomers() {
  bank.forEach(item => {
    let card = document.createElement('div');
    card.className = "customer_card";
    let name = document.createElement('h3');
    name.innerHTML = 'Customer name: ' + item.fullName;
    let id = document.createElement('h3');
    id.innerHTML = 'Customer ID: ' + item.codeId;
    let activity = document.createElement('h3');
    activity.innerHTML = 'Activity: ' + (item.isActive ? 'Active' : 'Not active');
    card.append(name, id, activity);
    document.querySelector('.customers_list_inner').append(card);
  });
}

showCustomers();