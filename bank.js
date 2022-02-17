let bank = [];

async function getExchangeRates (url) {
  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }

  return await res.json();
}
// let a1 = getExchangeRates("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
// console.log(a1)

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
    this.debitAccount = {}
  }
  setDebitAccount (debitAccountN, dateEndActive, debitBalance, debitCurrency) {
    this.debitAccount[debitAccountN] = {
      debitCurrency : debitCurrency || "UAH", //тип валюты UAH, RUB, USD, GBP, EUR и другие
      debitBalance  : debitBalance || 0, //текущий баланс, положителен либо нулевой
      dateEndActive : dateEndActive, //дата активности карты
    };
  }
  setCreditAccount (dateEndActive, creditFunds, creditLimit, creditCurrency) {
    this.creditAccount = {
      creditCurrency : creditCurrency || "UAH", //тип валюты UAH, RUB, USD, GBP, EUR и другие
      creditBalance : creditFunds || 0, //кредитные средства
      creditLimit : creditLimit || 0, //кредитный лимит
      dateEndActive : dateEndActive, //дата активности карты
    };
  }
}
let customerOne  = new Customer('vasya', true, '12.09.2021')
let customerTwo  = new Customer('petya', true, '12.09.2021')
let customerThree  = new Customer('valya', false, '12.09.2021')
let customerFour  = new Customer('masha', true, '12.09.2021')
let customerFive  = new Customer('olya', true, '12.09.2021')
customerOne.setDebitAccount('debit1','25.12.2023', 500)
customerOne.setDebitAccount('debit2','25.12.2023', 500)
customerOne.setDebitAccount('debit3','25.12.2023', 500)
customerOne.setCreditAccount('25.12.2023', 250, 200)

bank.push(customerOne,customerTwo,customerThree,customerFour,customerFive);

let debtBank = function() {
  let duty = 0;
  bank.forEach((item => {
    if (item.creditAccount && (item.creditAccount.creditLimit > item.creditAccount.creditBalance)) {
      duty += (item.creditAccount.creditLimit - item.creditAccount.creditBalance);
    }
  }))
  return duty;
};

console.log(bank)
console.log(debtBank())


