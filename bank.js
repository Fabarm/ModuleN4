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
  let forms = document.createElement('div');
  forms.className = 'forms';
  content.append(customersList, forms);
  let header = document.createElement('h2');
  header.innerHTML = 'Customers';
  let divInner = document.createElement('div');
  divInner.className = 'customers_list_inner';
  customersList.append(header, divInner);
}
pageHTML();

function showForms() {
  let forms = document.querySelector('.forms');
  let header = document.createElement('h2');
  header.innerHTML = 'Services';

  let formAdd = document.createElement('form');
  formAdd.className = 'form_add';
  let fieldsetFormAdd = document.createElement('fieldset');
  let legendFormAdd = document.createElement('legend');
  legendFormAdd.innerHTML = 'Form add customer';
  let pName = document.createElement('p');
  let pId = document.createElement('p');
  let pSelect = document.createElement('p');
  let inputName = document.createElement('input');
  inputName.id = 'input_name'
  inputName.placeholder = 'Enter full name customer';
  pName.append(inputName);
  let inputID = document.createElement('input');
  inputID.id = 'input_id'
  inputID.placeholder = 'Enter code ID customer';
  pId.append(inputID);
  let labelActive = document.createElement('label');
  labelActive.innerHTML = 'Select active customer';
  let selectFormAdd = document.createElement('select');
  selectFormAdd.id = 'select_form_add'
  selectFormAdd.name = 'formAdd';
  let firstOption = document.createElement('option');
  firstOption.value = 'true';
  firstOption.attributes = 'selected';
  firstOption.innerHTML = 'active';
  let secondOption = document.createElement('option');
  secondOption.value = 'false';
  secondOption.innerHTML = 'not active';
  selectFormAdd.append(firstOption, secondOption);
  pSelect.append(labelActive, selectFormAdd);
  let btnAdd = document.createElement('button');
  btnAdd.id = 'btn_add'
  btnAdd.innerHTML = 'Add customer';
  fieldsetFormAdd.append(legendFormAdd, pName, pId, pSelect, btnAdd);
  formAdd.append(fieldsetFormAdd);

  let formDelete = document.createElement('form');
  formDelete.className = 'form_delete';
  let fieldsetFormDelete = document.createElement('fieldset');
  let legendFormDelete = document.createElement('legend');
  legendFormDelete.innerHTML = 'Form delete customer';
  let labelFormDelete = document.createElement('label');
  labelFormDelete.innerHTML = 'Select customer ID';
  let pSelectFormDelete = document.createElement('p');
  let selectFormDelete = document.createElement('select');
  selectFormDelete.id = 'select_form_delete';
  selectFormDelete.name = 'formDelete';

  let optionZero = document.createElement('option');
  selectFormDelete.append(optionZero);
  bank.forEach(item => {
    let optionSelectFormDelete = document.createElement('option');
    optionSelectFormDelete.value = item.codeId;
    optionSelectFormDelete.innerHTML = item.codeId;
    selectFormDelete.append(optionSelectFormDelete);
  })

  pSelectFormDelete.append(labelFormDelete, selectFormDelete);
  let btnDelete = document.createElement('button');
  btnDelete.id = 'btn_delete';
  btnDelete.innerHTML = 'Delete customer';
  fieldsetFormDelete.append(legendFormDelete, pSelectFormDelete, btnDelete);
  formDelete.append(fieldsetFormDelete);

  let formAddBankAccount = document.createElement('form');
  formAddBankAccount.className = 'form_add_bank_account';
  let fieldsetFormAddBankAccount = document.createElement('fieldset');
  let legendFormAddBankAccount = document.createElement('legend');
  legendFormAddBankAccount.innerHTML = 'Form add bank account customer';
  let labelFormAddBankAccount = document.createElement('label');
  labelFormAddBankAccount.innerHTML = 'Select customer ID';
  let pSelectFormAddBankAccount = document.createElement('p');
  let selectFormAddBankAccount = document.createElement('select');
  selectFormAddBankAccount.id = 'form_add_bank_account'
  selectFormAddBankAccount.name = 'formAddBankAccount';
  let optionZero1 = document.createElement('option');
  selectFormAddBankAccount.append(optionZero1);
  bank.forEach(item => {
    let optionSelectFormAddBankAccount = document.createElement('option');
    optionSelectFormAddBankAccount.value = item.codeId;
    optionSelectFormAddBankAccount.innerHTML = item.codeId;
    selectFormAddBankAccount.append(optionSelectFormAddBankAccount);
  })

  pSelectFormAddBankAccount.append(labelFormAddBankAccount, selectFormAddBankAccount);
  let btnAddBankAccount = document.createElement('button');
  btnAddBankAccount.id = 'btn_add_bank_account';
  btnAddBankAccount.innerHTML = 'Add bank account customer';
  fieldsetFormAddBankAccount.append(legendFormAddBankAccount, pSelectFormAddBankAccount, btnAddBankAccount);
  formAddBankAccount.append(fieldsetFormAddBankAccount);
  forms.append(header, formAdd, formDelete, formAddBankAccount);
}
showForms();

function showCustomers() {
  bank.forEach(item => {
    let card = document.createElement('div');
    card.id = item.codeId;
    card.className = "customer_card";
    let name = document.createElement('h3');
    name.innerHTML = 'Name: ' + item.fullName;
    let id = document.createElement('h4');
    id.innerHTML = 'ID: ' + item.codeId;
    let activity = document.createElement('h4');
    activity.innerHTML = 'Activity: ' + (item.isActive ? 'Active' : 'Not active');
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
    document.querySelector('.customers_list_inner').append(card);
  });
}
showCustomers();

function dell(id) {
  let a = document.querySelector('.customers_list_inner');
  bank.forEach(item => {
    if(item.codeId === id){
      item.setDebitAccount('25.12.2023', 500, "UAH");
      a.innerHTML = '';
      showCustomers();
    }
  })
}

