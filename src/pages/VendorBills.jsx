import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { VendorBillsList } from '../shared/pages/vendor/VendorBillsList';

export const VendorBills = ({ onViewChange }) => {
  const { vendorBills, vendors, addVendorPayment } = useDemoData();
  return (
    <VendorBillsList
      vendorBills={vendorBills}
      vendors={vendors}
      addVendorPayment={addVendorPayment}
      onViewChange={onViewChange}
      mode="demo"
    />
  );
};
