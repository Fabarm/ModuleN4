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

let customerOne = new Customer('vasya', 1234,  'active', '12.09.2021');
let customerTwo = new Customer('petya', 1235,  'active', '12.09.2021');
let customerThree = new Customer('valya', 1236,  'not active', '12.09.2021');
let customerFour = new Customer('masha', 1237,  'active', '12.09.2021');
let customerFive = new Customer('olya', 1238,  'not active', '12.09.2021');

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
  let divInner = document.createElement('div');
  divInner.className = 'customersList_inner';
  customersList.append(headerList, divInner);
}
pageHTML();

function showCustomers() {
  if (bank.length > 0) {
    bank.forEach(item => {
      let card = document.createElement('div');
      card.id = item.codeId;
      card.className = "customerCard";
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
        debit.innerHTML = 'No debit accounts'
      }
      if (item.creditAccount.length) {
        credit.innerHTML = 'Amount credit accounts: ' + item.creditAccount.length;
      } else {
        credit.innerHTML = 'No credit accounts'
      }
      card.append(name, id, activity, debit, credit);
      document.querySelector('.customersList_inner').append(card);
    });
  } else {
    document.querySelector('.customersList_inner').append('Сustomers list is empty');
  }
}
showCustomers();

function showFormAdd() {
  let formAdd = document.querySelector('.formAdd');
  let fieldsetFormAdd = document.createElement('fieldset');
  fieldsetFormAdd.id = 'fieldsetFormAdd'
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
  document.querySelector('.forms').append(formAdd);
}
showFormAdd();

function showFormDelete() {
  let formDelete = document.querySelector('.formDelete');
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
  document.querySelector('.forms').append(formDelete);
}
showFormDelete();

function showFormAddBankAccount() {
  let formAddBankAccount = document.querySelector('.formAddBankAccount');
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
  let labelTypeAccount  = document.createElement('label');
  labelTypeAccount .innerHTML = 'Select type bank account';
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

  let divDebit = document.createElement('div');
  divDebit.className = 'divDebit';
  let inputDebitDataAccount = document.createElement('input');
  inputDebitDataAccount.id = 'inputDebitDataAccount';
  inputDebitDataAccount.placeholder = 'Enter expiration date';
  let inputDebitBalance = document.createElement('input');
  inputDebitBalance.id = 'inputDebitBalance';
  inputDebitBalance.placeholder = 'Enter balance customer';
  divDebit.append(inputDebitDataAccount, inputDebitBalance);

  let divCredit = document.createElement('div');
  divCredit.className = 'divCredit';
  let inputCreditDataAccount = document.createElement('input');
  inputCreditDataAccount.id = 'inputCreditDataAccount';
  inputCreditDataAccount.placeholder = 'Enter expiration date';
  let inputCreditBalance = document.createElement('input');
  inputCreditBalance.id = 'inputCreditBalance';
  inputCreditBalance.placeholder = 'Enter balance customer';
  let inputCreditLimit = document.createElement('input');
  inputCreditLimit.id = 'inputCreditLimit';
  inputCreditLimit.placeholder = 'Enter credit limit';
  divCredit.append(inputCreditDataAccount, inputCreditBalance, inputCreditLimit);

  let btnAddBankAccount = document.createElement('button');
  btnAddBankAccount.id = 'btn_add_bank_account';
  btnAddBankAccount.innerHTML = 'Add bank account';
  fieldsetFormAddBankAccount.append(legendFormAddBankAccount,
    pSelectFormAddBankAccount,
    pSelectTypeAccount,
    divDebit,
    divCredit,
    btnAddBankAccount);
  formAddBankAccount.append(fieldsetFormAddBankAccount);
  document.querySelector('.forms').append(formAddBankAccount);
}
showFormAddBankAccount();

let checkAccount = document.getElementById('selectTypeAccount');
checkAccount.addEventListener('change', (e) => {
  if (checkAccount.value === 'credit') {
    document.querySelector('.divDebit').style.display = 'none';
    document.querySelector('.divCredit').style.display = 'block';
  } else {
    document.querySelector('.divDebit').style.display = 'block';
    document.querySelector('.divCredit').style.display = 'none';
  }
})

let addCustomer = document.getElementById('btnAdd');
addCustomer.addEventListener("click", (e) => {
  e.preventDefault();
  let name = document.getElementById('inputName').value;
  let id = document.getElementById('inputID').value;
  let active = document.getElementById('selectFormAdd').value;
  let customer = new Customer(name, id, active);
  bank.push(customer);
  renderAll();
  document.querySelector('.formAdd').reset();
})


let deleteCustomer = document.getElementById('btnDelete');
deleteCustomer.addEventListener('click', (e) => {
  e.preventDefault();
  let id = Number(document.getElementById('selectFormDelete').value);

  bank.forEach((item, i)=> {
    if(item.codeId === id){
      bank.splice(i, 1);
      renderAll();
    }
  })
})

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
  let inner = document.querySelector('.customersList_inner');
  let selectFormDelete = document.querySelector('#selectFormDelete');
  let selectFormAddBankAccount = document.querySelector('#selectFormAddBankAccount');
  inner.innerHTML = '';
  showCustomers();
  selectFormDelete.innerHTML = '';
  renderSelect(selectFormDelete);
  selectFormAddBankAccount.innerHTML = '';
  renderSelect(selectFormAddBankAccount);
}

// function dell(id) {
//   let a = document.querySelector('.customers_list_inner');
//   bank.forEach(item => {
//     if(item.codeId === id){
//       item.setDebitAccount('25.12.2023', 500, "UAH");
//       a.innerHTML = '';
//       showCustomers();
//     }
//   })
// }