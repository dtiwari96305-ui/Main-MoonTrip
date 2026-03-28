import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { CreateVendorBill } from '../shared/pages/vendor/CreateVendorBill';

export const CreateVendorBillPage = ({ prefilledVendorId, onBack, onSuccess }) => {
  const { vendors, bookings, addVendor, addVendorBill } = useDemoData();
  return (
    <CreateVendorBill
      vendors={vendors}
      bookings={bookings}
      addVendor={addVendor}
      addVendorBill={addVendorBill}
      prefilledVendorId={prefilledVendorId}
      onBack={onBack}
      onSuccess={onSuccess}
    />
  );
};
