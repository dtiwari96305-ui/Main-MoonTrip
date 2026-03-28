import React from 'react';
import { useData } from '../context/DataContext';
import { realDb } from '../lib/realDb';
import { AccountsOverview } from '../../shared/pages/accounts/AccountsOverview';
import { HiddenMarkup } from '../../shared/pages/accounts/HiddenMarkup';
import { GeneralEntries } from '../../shared/pages/accounts/GeneralEntries';
import { BankAccounts } from '../../shared/pages/accounts/BankAccounts';
import { ReportsLanding } from '../../shared/pages/accounts/ReportsLanding';
import { PLReport } from '../../shared/pages/accounts/PLReport';
import { CashFlowReport } from '../../shared/pages/accounts/CashFlowReport';
import { BalanceSheet } from '../../shared/pages/accounts/BalanceSheet';
import { TrialBalance } from '../../shared/pages/accounts/TrialBalance';
import { DayBook } from '../../shared/pages/accounts/DayBook';
import { ChartOfAccounts } from '../../shared/pages/accounts/ChartOfAccounts';
import { JournalEntries } from '../../shared/pages/accounts/JournalEntries';
import { ManualJournalVoucher } from '../../shared/pages/accounts/ManualJournalVoucher';

export const RealAccounts = ({ view = 'accounts', onViewChange }) => {
  const data = useData();
  const props = { ...data, onViewChange, getJournalLines: realDb.getJournalLines, mode: 'real' };

  switch (view) {
    case 'accounts-markup':   return <HiddenMarkup {...props} />;
    case 'accounts-entries':  return <GeneralEntries {...props} />;
    case 'accounts-banks':    return <BankAccounts {...props} />;
    case 'accounts-reports':  return <ReportsLanding {...props} />;
    case 'accounts-pl':       return <PLReport {...props} />;
    case 'accounts-cashflow': return <CashFlowReport {...props} />;
    case 'accounts-balance':  return <BalanceSheet {...props} />;
    case 'accounts-trial':    return <TrialBalance {...props} />;
    case 'accounts-daybook':  return <DayBook {...props} />;
    case 'accounts-coa':      return <ChartOfAccounts {...props} />;
    case 'accounts-journal':  return <JournalEntries {...props} />;
    case 'accounts-mjv':      return <ManualJournalVoucher {...props} />;
    default:                  return <AccountsOverview {...props} />;
  }
};

export default RealAccounts;
