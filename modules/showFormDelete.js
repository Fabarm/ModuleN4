import renderSelect from "./renderSelect.js";

function showFormDelete(bank) {
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
  renderSelect(selectFormDelete, bank);
  pSelectFormDelete.append(labelFormDelete, selectFormDelete);
  let btnDelete = document.createElement('button');
  btnDelete.id = 'btnDelete';
  btnDelete.innerHTML = 'Delete customer';
  fieldsetFormDelete.append(legendFormDelete, pSelectFormDelete, btnDelete);
  formDelete.append(fieldsetFormDelete);
  document.querySelector('.forms').append(formDelete);
}

export default showFormDelete;