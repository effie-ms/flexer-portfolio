/* eslint-disable @next/next/no-img-element */
import {
  formatNumber,
  getPrecisionBySignificantFigures,
  isInvalidNumber,
  NO_DATA_INDICATOR,
} from "@/utils/numbers";

interface TokenItemProps {
  name: string;
  icon?: string | null;
  symbol: string;
  balance?: number | string | null;
  balanceUSD?: number | string | null;
  isLoading: boolean;
}

export const TokenItem = ({
  name,
  icon,
  symbol,
  balance,
  balanceUSD,
  isLoading,
}: TokenItemProps) => {
  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <div className="w-8 h-8 rounded-full bg-teal-500">
            {icon && (
              <img src={icon} alt={name} className="w-8 h-8 rounded-full" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[0.1rem]">
          <div className="font-medium text-white whitespace-nowrap truncate w-[100px] sm:w-full">
            {name}
          </div>
          {isLoading ? (
            <div className="h-[14px] w-[80px] rounded-md bg-white/10 animate-pulse" />
          ) : (
            <div className="text-xs text-white/80">
              {!isInvalidNumber(balance)
                ? formatNumber(Number(balance), {
                    postfix: symbol,
                    spaceAfterNumber: true,
                    precision: Math.max(
                      getPrecisionBySignificantFigures(Number(balance)),
                      2
                    ),
                    withAbbreviation: false,
                  })
                : NO_DATA_INDICATOR}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[0.2rem] text-right">
        {isLoading ? (
          <div className="h-5 w-[80px] rounded-md bg-white/10 animate-pulse" />
        ) : (
          <div className="text-sm font-medium text-white h-5">
            {!isInvalidNumber(balanceUSD) && balanceUSD !== null
              ? formatNumber(balanceUSD, {
                  prefix: "$",
                  precision: Math.max(
                    getPrecisionBySignificantFigures(Number(balanceUSD)),
                    2
                  ),
                  withAbbreviation: false,
                })
              : NO_DATA_INDICATOR}
          </div>
        )}
      </div>
    </div>
  );
};
