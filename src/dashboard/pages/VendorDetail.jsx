import React from 'react';
import { useData } from '../context/DataContext';
import { VendorDetail } from '../../shared/pages/vendor/VendorDetail';

export const RealVendorDetail = ({ vendorId, onBack, onViewChange }) => {
  const { vendors, vendorBills, vendorPayments, addVendorPayment } = useData();
  return (
    <VendorDetail
      vendorId={vendorId}
      vendors={vendors}
      vendorBills={vendorBills}
      vendorPayments={vendorPayments}
      addVendorPayment={addVendorPayment}
      onBack={onBack}
      onViewChange={onViewChange}
      mode="real"
    />
  );
};
