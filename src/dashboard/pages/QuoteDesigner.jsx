import React from 'react';
import { QuoteDesigner as DemoQuoteDesigner } from '../../pages/QuoteDesigner';

// Re-uses the demo QuoteDesigner component.
// useDemoPopup() returns a no-op outside DemoProvider.
export const RealQuoteDesigner = (props) => <DemoQuoteDesigner {...props} />;
