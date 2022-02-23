function showCustomers(bank) {
  let inner = document.querySelector('.customersList_inner');
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
      inner.append(card);
    });
  } else {
    inner.append('Customers list is empty');
  }
}

export default showCustomers;