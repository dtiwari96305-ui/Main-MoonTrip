import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { VendorPaymentsList } from '../shared/pages/vendor/VendorPaymentsList';

export const VendorPayments = ({ onViewChange }) => {
  const { vendorPayments, vendorBills, vendors, addVendorPayment } = useDemoData();
  return (
    <VendorPaymentsList
      vendorPayments={vendorPayments}
      vendorBills={vendorBills}
      vendors={vendors}
      addVendorPayment={addVendorPayment}
      onViewChange={onViewChange}
    />
  );
};
