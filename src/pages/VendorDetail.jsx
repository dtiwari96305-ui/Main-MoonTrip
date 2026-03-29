import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { VendorDetail } from '../shared/pages/vendor/VendorDetail';

export const VendorDetailPage = ({ vendorId, onBack, onViewChange }) => {
  const { vendors, vendorBills, vendorPayments, addVendorPayment } = useDemoData();
  return (
    <VendorDetail
      vendorId={vendorId}
      vendors={vendors}
      vendorBills={vendorBills}
      vendorPayments={vendorPayments}
      addVendorPayment={addVendorPayment}
      onBack={onBack}
      onViewChange={onViewChange}
      mode="demo"
    />
  );
};
