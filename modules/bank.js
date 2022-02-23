import renderHTML from "./showHTML.js";
import showInfo from "./showInfo.js";
import Customer from "./Customer.js";
import getExchangeRates from "./services.js";
import showCustomers from "./showCustomers.js";
import renderSelect from "./renderSelect.js";
import showFormAdd from "./showFormAdd.js";
import showFormDelete from "./showFormDelete.js";
import showFormAddBankAccount from "./showFormAddBankAccount.js";

let bank = [];

renderHTML();
showInfo();
showCustomers(bank);
showFormAdd();
showFormDelete(bank);
showFormAddBankAccount(bank);

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

  let creditDuty = document.getElementById('creditDuty');
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
            let temp = (item.balance - item.limit) / rates.USD.sale;
            cash += temp * rates[item.currency].sale;
          }
        });
      }));
    });

  let totalSum = document.getElementById('totalSum');
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
    let amountActive = document.getElementById('amountActiveCustomer');
    amountActive.innerHTML = `Amount active customer have a bank debt: ${amount}`;
  } else {
    let amountNotActive = document.getElementById('amountNotActiveCustomer');
    amountNotActive.innerHTML = `Amount not active customer have a bank debt: ${amount}`;
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

let regName = /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/;
let regID = /^[0-9]{13}$/;
let regDate = /(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[ \/\.\-]/;
let regBalance = /^[0-9]{3,9}$/;
let regLimit = /^[0-9]{3,6}$/;

let error = document.createElement('div');
let span = document.createElement('span');
span.innerHTML = 'Incorrect data entered';
error.append(span);

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
  document.querySelector('.formAdd').reset();
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
      document.querySelector('.formAddBankAccount').reset();
    }
  });
});

function renderAll() {
  let inner = document.querySelector('.customersList_inner');
  let selectFormDelete = document.querySelector('#selectFormDelete');
  let selectFormAddBankAccount = document.querySelector('#selectFormAddBankAccount');
  let divCredit = document.querySelector('.divCredit');
  inner.innerHTML = '';
  showCustomers(bank);
  selectFormDelete.innerHTML = '';
  renderSelect(selectFormDelete, bank);
  selectFormAddBankAccount.innerHTML = '';
  renderSelect(selectFormAddBankAccount, bank);
  divCredit.style.display = 'none';
  totalFunds();
  creditDutyAllCustomers();
}