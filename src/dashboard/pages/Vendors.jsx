import React from 'react';
import { useData } from '../context/DataContext';
import { VendorsList } from '../../shared/pages/vendor/VendorsList';

export const RealVendors = ({ onViewChange }) => {
  const { vendors, vendorBills, vendorPayments, addVendor } = useData();
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
