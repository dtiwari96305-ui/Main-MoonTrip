let _handler = null;
export const registerDesignerNav = (handler) => { _handler = handler; };
export const openDesigner = (quoteId, quoteData, fromView) => { if (_handler) _handler(quoteId, quoteData, fromView); };
