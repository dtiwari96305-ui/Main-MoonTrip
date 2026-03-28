import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { VendorsList } from '../shared/pages/vendor/VendorsList';

export const Vendors = ({ onViewChange }) => {
  const { vendors, vendorBills, vendorPayments, addVendor } = useDemoData();
  return (
    <VendorsList
      vendors={vendors}
      vendorBills={vendorBills}
      vendorPayments={vendorPayments}
      addVendor={addVendor}
      onViewChange={onViewChange}
    />
  );
};
