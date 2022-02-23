function renderSelect(select, bank) {
  let optionZero = document.createElement('option');
  select.append(optionZero);
  bank.forEach(item => {
    let optionSelectFormDelete = document.createElement('option');
    optionSelectFormDelete.value = item.codeId;
    optionSelectFormDelete.innerHTML = item.codeId;
    select.append(optionSelectFormDelete);
  });
}

export default renderSelect;