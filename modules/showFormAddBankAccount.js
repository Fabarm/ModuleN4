import renderSelect from "./renderSelect.js";

function showFormAddBankAccount(bank) {
  let formAddBankAccount = document.querySelector('.formAddBankAccount');
  let fieldsetFormAddBankAccount = document.createElement('fieldset');
  let legendFormAddBankAccount = document.createElement('legend');
  legendFormAddBankAccount.innerHTML = 'Form add bank account';
  let labelFormAddBankAccount = document.createElement('label');
  labelFormAddBankAccount.innerHTML = 'Select customer ID';
  let selectFormAddBankAccount = document.createElement('select');
  selectFormAddBankAccount.id = 'selectFormAddBankAccount';
  selectFormAddBankAccount.name = 'formAddBankAccount';
  renderSelect(selectFormAddBankAccount, bank);
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
  document.querySelector('.forms').append(formAddBankAccount);

  selectTypeAccount.addEventListener('change', () => {
    if (selectTypeAccount.value === 'credit') {
      divCredit.style.display = 'block';
    } else {
      divCredit.style.display = 'none';
    }
  });


}
export default showFormAddBankAccount;
