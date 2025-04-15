import clsx from "clsx";
import {Dropdown} from "./ui/Dropdown";
import Image from "next/image";
import {shortenHash} from "@/utils/numbers";
import {WalletType} from "@/types/wallets";

interface AccountSelectorProps {
  accounts: WalletType[];
  selectedAccount: WalletType | null;
  setSelectedAccount: (account: WalletType) => void;
}

export const AccountSelector = ({
  accounts,
  selectedAccount,
  setSelectedAccount,
}: AccountSelectorProps) => {
  return (
    <Dropdown
      options={accounts
        .filter((acc) => acc.address)
        .map((account) => ({
          ...account,
          key: account.address || "",
        }))}
      selectedKey={selectedAccount?.address || null}
      onChange={(key: string) => {
        const account = accounts.find((acc) => acc.address === key) || null;
        if (!account) return;
        setSelectedAccount(account);
      }}
      renderButton={(selectedOption, isOpen, toggle) => (
        <button
          key={selectedOption?.address}
          type="button"
          onClick={toggle}
          className="w-full px-3 py-2 text-sm bg-white/10 text-white border border-white/10 rounded-lg flex items-center justify-between cursor-pointer"
        >
          {selectedOption ? (
            <div className="flex items-center gap-2 relative">
              <div className="relative w-8 h-8 rounded-md">
                <Image
                  src={selectedOption.icon}
                  alt={selectedOption?.address || ""}
                  className="rounded-full"
                  width={32}
                  height={32}
                />
              </div>
              <div className="text-white text-sm ml-2">
                {shortenHash(selectedOption.address || "")}
              </div>
            </div>
          ) : (
            <div className="text-sm text-white">Select account</div>
          )}
          <svg
            className={clsx(
              "w-4 h-4 transition-transform duration-200 ease-in-out",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
      renderOption={(option, isSelected) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 relative">
            <div className="w-8 h-8 rounded-md">
              <Image
                src={option.icon}
                alt={option?.address || ""}
                className="rounded-md"
                width={32}
                height={32}
              />
            </div>
            <div className="text-white text-sm ml-2">
              {shortenHash(option?.address || "")}
            </div>
          </div>
          {isSelected && (
            <Image
              src="/icons/checkmark.svg"
              alt="Selected"
              width={16}
              height={16}
            />
          )}
        </div>
      )}
    />
  );
};
