let _handler = null;

export const registerBookingNav = (handler) => { _handler = handler; };

export const openBookingDetail = (bookingId, fromView) => {
  if (_handler) _handler(bookingId, fromView);
};
