import {withAccounts} from "@/decorators/withAccounts";
import {AccountWrapper} from "./Account";
import {AccountType} from "@/types/wallets";
import {useState} from "react";
import {AccountSelector} from "./AccountSelector";

interface AccountsWrapperProps {
  wallets: AccountType[];
}

interface AccountsProps {
  accounts: AccountType[];
  initialAccount: AccountType;
}

export const AccountsWrapper = ({wallets}: AccountsWrapperProps) => {
  const ActiveAccounts = withAccounts(wallets)(Accounts);
  return (
    <div className="w-full bg-white/5 rounded-3xl border border-white/10 h-full p-5">
      <h2>Accounts</h2>
      <ActiveAccounts />
    </div>
  );
};

const Accounts = ({accounts, initialAccount}: AccountsProps) => {
  const [selectedAccount, setSelectedAccount] =
    useState<AccountType>(initialAccount);

  return (
    <div className="flex flex-col w-full gap-3 my-5">
      <AccountSelector
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
      {Boolean(selectedAccount) ? (
        <AccountWrapper selectedAccount={selectedAccount} />
      ) : (
        <div className="text-sm text-gray-300 italic mb-5">
          Account not available.
        </div>
      )}
    </div>
  );
};
