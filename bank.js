let bank = [];

async function getExchangeRates() {
  let res = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");

  if (!res.ok) {
    throw new Error(`Could not fetch , status: ${res.status}`);
  }

  return await res.json();
}
let a = getExchangeRates();
console.log(a)
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
      currency : currency || "UAH",
      balance  : balance || 0,
      dateEndActive : date,
    });
  }
  setCreditAccount (date, balance, limit, currency) {
    this.creditAccount.push({
      currency : currency || "UAH",
      balance : balance || 0,
      limit : limit || 0,
      dateEndActive : date,
    });
  }
}

let customerOne  = new Customer('vasya', true, '12.09.2021');
let customerTwo  = new Customer('petya', true, '12.09.2021');
let customerThree  = new Customer('valya', false, '12.09.2021');
let customerFour  = new Customer('masha', true, '12.09.2021');
let customerFive  = new Customer('olya', true, '12.09.2021');
customerOne.setDebitAccount('25.12.2023', 500);
customerOne.setDebitAccount('25.12.2023', 500);
customerOne.setDebitAccount('25.12.2023', 500)
customerOne.setCreditAccount('25.12.2023', 150, 200);
customerOne.setCreditAccount('25.12.2023', 250, 500)
customerThree.setCreditAccount('25.12.2023', 150, 200);
customerThree.setCreditAccount('25.12.2023', 250, 500);
customerTwo.setCreditAccount('25.12.2023', 400, 500, "USA");
customerTwo.setCreditAccount('25.12.2023', 300, 500, "RUR");
customerTwo.setCreditAccount('25.12.2023', 200, 500, "EUR");
customerTwo.setCreditAccount('25.12.2023', 100, 500, 'USA');

bank.push(customerOne,customerTwo,customerThree,customerFour,customerFive);

let creditDutyAllCustomers = async function() {
  let duty = 0;
  await getExchangeRates()
    .then(res => {
      bank.forEach(((item)=> {
        if (item.creditAccount.length) {
          item.creditAccount.forEach(item => {
            if (item.limit > item.balance){
              if(item.currency === "UAH"){
                duty += (item.limit - item.balance) / res[0].sale;
              } else if(item.currency === "RUR"){
                duty += (item.limit - item.balance) * res[2].sale / res[0].sale;
              } else if(item.currency === "EUR"){
                duty += (item.limit - item.balance) * res[1].sale / res[0].sale;
              } else {
                duty += (item.limit - item.balance);
              }
            }
          })
        }
      }));
    })

  return duty;
};

console.log(bank)
console.log(creditDutyAllCustomers())


