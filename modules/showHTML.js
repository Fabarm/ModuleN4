function renderHTML() {
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
}

export default renderHTML;