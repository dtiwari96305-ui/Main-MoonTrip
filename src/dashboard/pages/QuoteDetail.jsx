import React from 'react';
import { QuoteDetail as DemoQuoteDetail } from '../../pages/QuoteDetail';

// Re-uses the demo QuoteDetail component.
// useDemoPopup() returns a no-op outside DemoProvider, so save actions silently do nothing.
// Future: replace with full real CRUD version.
export const RealQuoteDetail = (props) => <DemoQuoteDetail {...props} />;
