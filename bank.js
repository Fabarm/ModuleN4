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
let totalSum = {};
let debtBank = {};

bank.forEach((item => {
    if (totalSum[item.currencyType] === undefined) {
        totalSum[item.currencyType] = item.balance
    } else {
        totalSum[item.currencyType] += item.balance
    }

    if(item.bankAccount === 'credit') {
        if((item.creditLimit - item.balance) > 0){
            if (debtBank[item.currencyType] === undefined) {
                debtBank[item.currencyType] = (item.creditLimit - item.balance)
            } else {
                debtBank[item.currencyType] += (item.creditLimit - item.balance)
            }
        }
    }

}))

console.log(totalSum);
console.log(debtBank);
// fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
//     .then(data => data.json())
//     .then(res => console.log(res))
