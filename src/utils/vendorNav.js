// Module-level singleton for navigating to vendor pages.
// Any component can import these without prop-drilling.

let _handler = null;

export const registerVendorNav = (handler) => {
  _handler = handler;
};

export const openVendorDetail = (vendorId, fromView) => {
  if (_handler) _handler('vendor-detail', vendorId, fromView);
};

export const openCreateVendorBill = (vendorId, fromView) => {
  if (_handler) _handler('create-vendor-bill', vendorId, fromView);
};

export const openVendorBillDetail = (billId, fromView) => {
  if (_handler) _handler('vendor-bill-detail', billId, fromView);
};
