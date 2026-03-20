let _handler = null;

export const registerCreateQuoteNav = (handler) => { _handler = handler; };

export const openCreateQuoteWithCustomer = (customer, fromView) => {
  if (_handler) _handler(customer, fromView);
};
