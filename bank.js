let bank = [
  {
    fullName : 'Sidorov S.S.',
    isActive : true,
    dateReg : '13.09.2013',
    bankAccount : 'debit',
    currencyType : 'UAH',
    balance : 1500,
    endActiveCard : '13.09.2023',
  },
  {
    fullName : 'Petrov P.P.',
    isActive : true,
    dateReg : '23.01.2015',
    bankAccount : 'credit',
    currencyType : 'UAH',
    balance : 2500,
    creditLimit : 1000,
    endActiveCard : '03.05.2025',
  },
  {
    fullName : 'Ivanov I.I.',
    isActive : true,
    dateReg : '10.10.2010',
    bankAccount : 'debit',
    currencyType : 'USA',
    balance : 3500,
    endActiveCard : '30.09.2024',
  },
  {
    fullName : 'Ivanenko I.I.',
    isActive : true,
    dateReg : '15.01.2018',
    bankAccount : 'debit',
    currencyType : 'USA',
    balance : 1500,
    endActiveCard : '03.03.2023',
  },
  {
    fullName : 'Petrichenko P.P.',
    isActive : true,
    dateReg : '25.11.2020',
    bankAccount : 'credit',
    currencyType : 'UAH',
    balance : 3500,
    creditLimit : 1500,
    endActiveCard : '13.10.2025',
  },
  {
    fullName : 'Sidorenko I.I.',
    isActive : true,
    dateReg : '05.05.2019',
    bankAccount : 'debit',
    currencyType : 'USA',
    balance : 800,
    endActiveCard : '07.06.2028',
  },
  {
    fullName : 'Stepanenko P.P.',
    isActive : false,
    dateReg : '25.11.2020',
    bankAccount : 'credit',
    currencyType : 'UAH',
    balance : 1000,
    creditLimit : 1500,
    endActiveCard : '13.10.2025',
  },
  {
    fullName : 'Stepanenko P.P.',
    isActive : true,
    dateReg : '05.11.2019',
    bankAccount : 'credit',
    currencyType : 'USA',
    balance : 700,
    creditLimit : 1500,
    endActiveCard : '28.01.2023',
  },
];

let totalSum = () => {
  let total = {};
  bank.forEach((item => {
    if (total[item.currencyType] === undefined) {
      total[item.currencyType] = item.balance;
    } else {
      total[item.currencyType] += item.balance;
    }
  }))

  return total;
};

let debtBank = function() {
  let duty = {};
  bank.forEach((item => {
    if (item.bankAccount === 'credit') {
      if((item.creditLimit - item.balance) > 0){
        if (duty[item.currencyType] === undefined) {
          duty[item.currencyType] = (item.creditLimit - item.balance);
        } else {
          duty[item.currencyType] += (item.creditLimit - item.balance);
        }
      }
    }
  }))
 return duty;
};
debtBank();


function assets()  {
  fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    .then(data => data.json())
    .then(res => {
      let sum = 0;
      bank.forEach(item => {
        if (item.currencyType === "UAH") {
          item.balance /= res[0].buy;
        }
        sum += item.balance;
      })
      document.querySelector(".total").textContent = `Общее количество денег внутри банка - ${sum.toFixed(2)} $`
    });
}
assets();
function duty()  {
  fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    .then(data => data.json())
    .then(res => {

      let obj = debtBank();
      let sum = obj.USA + obj.UAH / res[0].buy;

      document.querySelector(".duty").textContent = `Сумма долга клиентов - ${sum.toFixed(2)} $`
    });
}
duty();
fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
  .then(data => data.json())
  .then(res => console.log(res))


