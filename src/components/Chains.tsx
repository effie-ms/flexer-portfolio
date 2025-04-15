/* eslint-disable @next/next/no-img-element */
import {LifiChain} from "@/types/chains";
import Image from "next/image";
import clsx from "clsx";
import {Dropdown} from "./ui/Dropdown";

interface ChainsProps {
  chains: LifiChain[];
  selectedChain: LifiChain;
  setSelectedChain: (chain: LifiChain) => void;
}

export const Chains = ({
  chains,
  selectedChain,
  setSelectedChain,
}: ChainsProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-white text-sm">Chain:</div>
      <div>
        <Dropdown
          options={chains}
          selectedKey={selectedChain.key}
          onChange={(key: string) => {
            const chain = chains.find((chain) => chain.key === key) || null;
            if (chain) {
              setSelectedChain(chain);
            }
          }}
          renderButton={(selectedOption, isOpen, toggle) => (
            <button
              type="button"
              onClick={toggle}
              className="w-full px-3 py-2 text-sm bg-white/10 text-white border border-white/10 rounded-lg flex items-center justify-between cursor-pointer"
            >
              {selectedOption ? (
                <div className="flex items-center gap-2 relative">
                  <div className="w-8 h-8 rounded-full bg-cyan-500">
                    {selectedOption.logoURI && (
                      <img
                        src={selectedOption.logoURI}
                        alt={selectedOption.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                  <div className="text-white text-sm ml-2">
                    {selectedOption.name}
                  </div>
                  {selectedOption.mainnet && (
                    <span className="text-xs text-white bg-cyan-500/50 px-1 rounded-md">
                      Mainnet
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-white">Select chain</div>
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
                <div className="w-8 h-8 rounded-full bg-cyan-500">
                  {option.logoURI && (
                    <img
                      src={option.logoURI}
                      alt={option.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
                <div className="text-white text-sm ml-2">{option.name}</div>
                {option.mainnet && (
                  <span className="text-xs text-white bg-cyan-500/50 px-1 rounded-md">
                    Mainnet
                  </span>
                )}
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
      </div>
    </div>
  );
};
