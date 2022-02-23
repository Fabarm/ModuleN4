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
    this.dateReg = dateReg || Date.now();
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

  creditDuty.innerHTML = `Customer debt: ${duty} $`;
};
creditDutyAllCustomers();

let totalFunds = async function() {
  let cash = 0;

  await getExchangeRates()
    .then(rates => {
      bank.forEach((customer => {
        customer.debitAccount.forEach(item => {
          let temp = item.balance / rates.USD.sale;
          cash += temp * rates[item.currency].sale;
        });

        customer.creditAccount.forEach(item => {
          if (item.limit < item.balance) {
            let temp = (item.limit - item.balance) / rates.USD.sale;
            cash += temp * rates[item.currency].sale;
          }
        });
      }));
    });

  totalSum.innerHTML = `The total amount of money in the bank: ${cash} $`;
  amountCustomersDebtors('active');
  amountCustomersDebtors('not active');
};
totalFunds();

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

  if (status === 'active') {
    amountActiveCustomer.innerHTML = `Amount active customer have a bank debt: ${amount}`;
  } else {
    amountNotActiveCustomer.innerHTML = `Amount not active customer have a bank debt: ${amount}`;
  }
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

let container = document.createElement('div');
container.className = 'container';
document.body.append(container);
let content = document.createElement('div');
content.className = 'content';
container.append(content);
let customersList = document.createElement('div');
customersList.className = 'customersList';
let forms = document.createElement('div');
forms.className = 'forms';
content.append(customersList, forms);
let headerForms = document.createElement('h2');
headerForms.innerHTML = 'Services';
let formAdd = document.createElement('form');
formAdd.className = 'formAdd';
let formDelete = document.createElement('form');
formDelete.className = 'formDelete';
let formAddBankAccount = document.createElement('form');
formAddBankAccount.className = 'formAddBankAccount';
forms.append(headerForms, formAdd, formDelete, formAddBankAccount);
let headerList = document.createElement('h2');
headerList.innerHTML = 'Customers';
let divInfo = document.createElement('div');
divInfo.className = 'info';
let divListInner = document.createElement('div');
divListInner.className = 'customersList_inner';
customersList.append(headerList, divInfo, divListInner);

let fieldsetFormAdd = document.createElement('fieldset');
fieldsetFormAdd.id = 'fieldsetFormAdd';
let legendFormAdd = document.createElement('legend');
legendFormAdd.innerHTML = 'Form add customer';
let pName = document.createElement('p');
let pId = document.createElement('p');
let pSelect = document.createElement('p');
let inputName = document.createElement('input');
inputName.id = 'inputName';
inputName.placeholder = 'Enter full name customer';
pName.append(inputName);
let inputID = document.createElement('input');
inputID.id = 'inputID';
inputID.placeholder = 'Enter code ID customer';
pId.append(inputID);
let labelActive = document.createElement('label');
labelActive.innerHTML = 'Select active customer';
let selectFormAdd = document.createElement('select');
selectFormAdd.id = 'selectFormAdd';
selectFormAdd.name = 'formAdd';
let firstOption = document.createElement('option');
firstOption.value = 'active';
firstOption.innerHTML = 'active';
let secondOption = document.createElement('option');
secondOption.value = 'not active';
secondOption.innerHTML = 'not active';
selectFormAdd.append(firstOption, secondOption);
pSelect.append(labelActive, selectFormAdd);
let btnAdd = document.createElement('button');
btnAdd.id = 'btnAdd';
btnAdd.innerHTML = 'Add customer';
fieldsetFormAdd.append(legendFormAdd, pName, pId, pSelect, btnAdd);
formAdd.append(fieldsetFormAdd);
forms.append(formAdd);

let fieldsetFormDelete = document.createElement('fieldset');
let legendFormDelete = document.createElement('legend');
legendFormDelete.innerHTML = 'Form delete customer';
let labelFormDelete = document.createElement('label');
labelFormDelete.innerHTML = 'Select customer ID';
let pSelectFormDelete = document.createElement('p');
let selectFormDelete = document.createElement('select');
selectFormDelete.id = 'selectFormDelete';
selectFormDelete.name = 'formDelete';
renderSelect(selectFormDelete);
pSelectFormDelete.append(labelFormDelete, selectFormDelete);
let btnDelete = document.createElement('button');
btnDelete.id = 'btnDelete';
btnDelete.innerHTML = 'Delete customer';
fieldsetFormDelete.append(legendFormDelete, pSelectFormDelete, btnDelete);
formDelete.append(fieldsetFormDelete);
forms.append(formDelete);

let fieldsetFormAddBankAccount = document.createElement('fieldset');
let legendFormAddBankAccount = document.createElement('legend');
legendFormAddBankAccount.innerHTML = 'Form add bank account';
let labelFormAddBankAccount = document.createElement('label');
labelFormAddBankAccount.innerHTML = 'Select customer ID';
let selectFormAddBankAccount = document.createElement('select');
selectFormAddBankAccount.id = 'selectFormAddBankAccount';
selectFormAddBankAccount.name = 'formAddBankAccount';
renderSelect(selectFormAddBankAccount);
let pSelectFormAddBankAccount = document.createElement('p');
pSelectFormAddBankAccount.append(labelFormAddBankAccount, selectFormAddBankAccount);
let labelTypeAccount = document.createElement('label');
labelTypeAccount.innerHTML = 'Select type bank account';
let selectTypeAccount = document.createElement('select');
selectTypeAccount.id = 'selectTypeAccount';
selectTypeAccount.name = 'formAdd';
let optionDebit = document.createElement('option');
optionDebit.value = 'debit';
optionDebit.innerHTML = 'debit';
let optionCredit = document.createElement('option');
optionCredit.value = 'credit';
optionCredit.innerHTML = 'credit';
selectTypeAccount.append(optionDebit, optionCredit);
let pSelectTypeAccount = document.createElement('p');
pSelectTypeAccount.append(labelTypeAccount, selectTypeAccount);
let labelTypeCurrency = document.createElement('label');
labelTypeCurrency.innerHTML = 'Select type currency';
let selectTypeCurrency = document.createElement('select');
selectTypeCurrency.id = 'selectTypeCurrency';
selectTypeCurrency.name = 'formAddBankAccount';
let optionUAH = document.createElement('option');
optionUAH.value = 'UAH';
optionUAH.innerHTML = 'UAH';
let optionUSD = document.createElement('option');
optionUSD.value = 'USD';
optionUSD.innerHTML = 'USD';
let optionRUR = document.createElement('option');
optionRUR.value = 'RUR';
optionRUR.innerHTML = 'RUR';
let optionEUR = document.createElement('option');
optionEUR.value = 'EUR';
optionEUR.innerHTML = 'EUR';
selectTypeCurrency.append(optionUAH, optionUSD, optionRUR, optionEUR);
let pSelectTypeCurrency = document.createElement('p');
pSelectTypeCurrency.append(labelTypeCurrency, selectTypeCurrency);
let inputDataAccount = document.createElement('input');
inputDataAccount.id = 'inputDataAccount';
inputDataAccount.placeholder = 'Enter expiration date';
let inputBalance = document.createElement('input');
inputBalance.id = 'inputBalance';
inputBalance.placeholder = 'Enter balance customer';
let divCredit = document.createElement('div');
divCredit.className = 'divCredit';
let inputCreditLimit = document.createElement('input');
inputCreditLimit.id = 'inputCreditLimit';
inputCreditLimit.placeholder = 'Enter credit limit';
divCredit.append(inputCreditLimit);
let btnAddBankAccount = document.createElement('button');
btnAddBankAccount.id = 'btn_add_bank_account';
btnAddBankAccount.innerHTML = 'Add bank account';
fieldsetFormAddBankAccount.append(legendFormAddBankAccount,
  pSelectFormAddBankAccount,
  pSelectTypeAccount,
  pSelectTypeCurrency,
  inputDataAccount,
  inputBalance,
  divCredit,
  btnAddBankAccount);
formAddBankAccount.append(fieldsetFormAddBankAccount);
forms.append(formAddBankAccount);

let regName = /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/;
let regID = /^[0-9]{13}$/;
let regDate = /(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[ \/\.\-]/;
let regBalance = /^[0-9]{3,9}$/;
let regLimit = /^[0-9]{3,6}$/;
let error = document.createElement('div');
let span = document.createElement('span');
span.innerHTML = 'Incorrect data entered';
error.append(span);

let checkAccount = document.getElementById('selectTypeAccount');
checkAccount.addEventListener('change', () => {
  if (checkAccount.value === 'credit') {
    divCredit.style.display = 'block';
  } else {
    divCredit.style.display = 'none';
  }
});

let addCustomer = document.getElementById('btnAdd');
addCustomer.addEventListener('click', (event) => {
  event.preventDefault();
  let name = document.getElementById('inputName').value;
  let id = document.getElementById('inputID').value;
  let active = document.getElementById('selectFormAdd').value;
  if (error) {
    error.remove();
  }
  if (regName.test(name) && regID.test(id)) {
    let customer = new Customer(name, id, active);
    bank.push(customer);
  } else {
    addCustomer.before(error);
  }
  renderAll();
  formAdd.reset();
});

let deleteCustomer = document.getElementById('btnDelete');
deleteCustomer.addEventListener('click', (event) => {
  event.preventDefault();
  let id = document.getElementById('selectFormDelete').value;

  bank.forEach((item, i) => {
    if (item.codeId === id) {
      bank.splice(i, 1);
      renderAll();
    }
  });
});

let addBankAccount = document.getElementById('btn_add_bank_account');
addBankAccount.addEventListener('click', (event) => {
  event.preventDefault();
  let id = document.getElementById('selectFormAddBankAccount').value;
  let typeAccount = document.getElementById('selectTypeAccount').value;
  let currency = document.getElementById('selectTypeCurrency').value;
  let data = document.getElementById('inputDataAccount').value;
  let balance = document.getElementById('inputBalance').value;
  let limit = document.getElementById('inputCreditLimit').value;
  if (error) {
    error.remove();
  }
  bank.forEach(item => {
    if (item.codeId === id) {
      if (typeAccount === 'debit') {
        if (regDate.test(data) && regBalance.test(balance)) {
          item.setDebitAccount(data, balance, currency);
        } else {
          addBankAccount.before(error);
        }
      } else {
        if (regDate.test(data) && regBalance.test(balance) && regLimit.test(limit)) {
          item.setCreditAccount(data, balance, limit, currency);
        } else {
          addBankAccount.before(error);
        }
      }
      renderAll();
      formAddBankAccount.reset();
    }
  });
});

function showCustomers() {
  if (bank.length > 0) {
    bank.forEach(item => {
      let card = document.createElement('div');
      card.id = item.codeId;
      card.className = 'customerCard';
      let name = document.createElement('h3');
      name.innerHTML = 'Name: ' + item.fullName;
      let id = document.createElement('h4');
      id.innerHTML = 'ID: ' + item.codeId;
      let activity = document.createElement('h4');
      activity.innerHTML = 'Activity: ' + item.isActive;
      let debit = document.createElement('h4');
      let credit = document.createElement('h4');
      if (item.debitAccount.length) {
        debit.innerHTML = 'Amount debit accounts: ' + item.debitAccount.length;
      } else {
        debit.innerHTML = 'No debit accounts';
      }
      if (item.creditAccount.length) {
        credit.innerHTML = 'Amount credit accounts: ' + item.creditAccount.length;
      } else {
        credit.innerHTML = 'No credit accounts';
      }
      card.append(name, id, activity, debit, credit);
      divListInner.append(card);
    });
  } else {
    divListInner.append('Customers list is empty');
  }
}
showCustomers();

let totalSum = document.createElement('div');
totalSum.id ='totalSum';
let creditDuty = document.createElement('div');
creditDuty.id = 'creditDuty';
let amountActiveCustomer = document.createElement('div');
amountActiveCustomer.id = 'amountActiveCustomer';
let amountNotActiveCustomer = document.createElement('div');
amountNotActiveCustomer.id = 'amountNotActiveCustomer';
divInfo.append(totalSum, creditDuty, amountActiveCustomer, amountNotActiveCustomer);

function renderSelect(select) {
  let optionZero = document.createElement('option');
  select.append(optionZero);
  bank.forEach(item => {
    let optionSelectFormDelete = document.createElement('option');
    optionSelectFormDelete.value = item.codeId;
    optionSelectFormDelete.innerHTML = item.codeId;
    select.append(optionSelectFormDelete);
  });
}

function renderAll() {
  divListInner.innerHTML = '';
  showCustomers();
  selectFormDelete.innerHTML = '';
  renderSelect(selectFormDelete);
  selectFormAddBankAccount.innerHTML = '';
  renderSelect(selectFormAddBankAccount);
  divCredit.style.display = 'none';
  totalFunds();
  creditDutyAllCustomers();
}