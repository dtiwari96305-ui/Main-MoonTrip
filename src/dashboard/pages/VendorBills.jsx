import React from 'react';
import { useData } from '../context/DataContext';
import { VendorBillsList } from '../../shared/pages/vendor/VendorBillsList';

export const RealVendorBills = ({ onViewChange }) => {
  const { vendorBills, vendors, addVendorPayment } = useData();
  return (
    <VendorBillsList
      vendorBills={vendorBills}
      vendors={vendors}
      addVendorPayment={addVendorPayment}
      onViewChange={onViewChange}
      mode="real"
    />
  );
};
