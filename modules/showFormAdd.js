function showFormAdd() {
  let formAdd = document.querySelector('.formAdd');
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
  document.querySelector('.forms').append(formAdd);
}

export default showFormAdd;