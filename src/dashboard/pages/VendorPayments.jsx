import React from 'react';
import { useData } from '../context/DataContext';
import { VendorPaymentsList } from '../../shared/pages/vendor/VendorPaymentsList';

export const RealVendorPayments = ({ onViewChange }) => {
  const { vendorPayments, vendorBills, vendors, addVendorPayment } = useData();
  return (
    <VendorPaymentsList
      vendorPayments={vendorPayments}
      vendorBills={vendorBills}
      vendors={vendors}
      addVendorPayment={addVendorPayment}
      onViewChange={onViewChange}
      mode="real"
    />
  );
};
