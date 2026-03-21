let _handler = null;

export const registerEditQuoteNav = (handler) => {
  _handler = handler;
};

export const openEditQuote = (formData) => {
  if (_handler) _handler(formData);
};
