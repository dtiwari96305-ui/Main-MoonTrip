let _billingNavHandler = null;

export const registerBillingNav = (handler) => {
  _billingNavHandler = handler;
};

export const openBilling = (fromView) => {
  if (_billingNavHandler) _billingNavHandler(fromView);
};
