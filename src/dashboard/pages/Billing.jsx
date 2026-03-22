import React from 'react';
import { Billing as DemoBilling } from '../../pages/Billing';

// Re-uses the demo Billing component.
// useDemoPopup() returns a no-op outside DemoProvider.
export const RealBilling = (props) => <DemoBilling {...props} />;
