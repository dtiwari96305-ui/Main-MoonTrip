import React from 'react';
import { useData } from '../context/DataContext';
import { CreateVendorBill } from '../../shared/pages/vendor/CreateVendorBill';

export const RealCreateVendorBill = ({ prefilledVendorId, onBack, onSuccess }) => {
  const { vendors, bookings, addVendor, addVendorBill } = useData();
  return (
    <CreateVendorBill
      vendors={vendors}
      bookings={bookings}
      addVendor={addVendor}
      addVendorBill={addVendorBill}
      prefilledVendorId={prefilledVendorId}
      onBack={onBack}
      onSuccess={onSuccess}
      mode="real"
    />
  );
};
