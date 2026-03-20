// Simple module-level singleton for navigating to a customer profile.
// Any component can import openCustomerProfile without prop-drilling.

let _handler = null;

export const registerCustomerNav = (handler) => {
  _handler = handler;
};

export const openCustomerProfile = (customerId, fromView) => {
  if (_handler) _handler(customerId, fromView);
};
