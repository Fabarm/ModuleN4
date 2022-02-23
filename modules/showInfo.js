function showInfo() {
  let info = document.querySelector('.info');
  let totalFunds = document.createElement('div');
  totalFunds.id ='totalSum';
  let creditDuty = document.createElement('div');
  creditDuty.id = 'creditDuty';
  let amountActiveCustomer = document.createElement('div');
  amountActiveCustomer.id = 'amountActiveCustomer';
  let amountNotActiveCustomer = document.createElement('div');
  amountNotActiveCustomer.id = 'amountNotActiveCustomer';
  info.append(totalFunds, creditDuty, amountActiveCustomer, amountNotActiveCustomer);
}

export default showInfo;