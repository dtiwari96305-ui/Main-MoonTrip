import React from 'react';
import { BookingDetail as DemoBookingDetail } from '../../pages/BookingDetail';

// Re-uses the demo BookingDetail component.
// useDemoPopup() returns a no-op outside DemoProvider.
export const RealBookingDetail = (props) => <DemoBookingDetail {...props} />;
