// Simple module-level singleton for navigating to a quote detail view.
// Any component can import openQuoteDetail without prop-drilling.

let _handler = null;

export const registerQuoteNav = (handler) => {
  _handler = handler;
};

export const openQuoteDetail = (quoteId, fromView) => {
  if (_handler) _handler(quoteId, fromView);
};
