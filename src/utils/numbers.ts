import numeral from "numeral";

export const MAX_SIGNIFICANT_FIGURES_NUMBER = 6;
export const MINIMUM_NUMBER = 0.000001;
export const NO_DATA_INDICATOR = "N/A";

const DEFAULT_FORMATTING_PARAMS = {
  precision: null,
  allowEmpty: true, // If true, will return an empty string for an empty number, otherwise NO_DATA_INDICATOR
  withAbbreviation: true, // if true, it will use k - thousand, m - million, b - billion, t - trillion
  forcePrecision: true, // if true, it will keep the specified number of decimal places, otherwise it will truncate the trailing zeros.
  showApproximation: false, // if true, it will show ~0, otherwise it will show the actual within the precision
  prefix: "",
  postfix: "",
  spaceBeforeNumber: false, // if true, it will add a space between the number and the postfix
  spaceAfterNumber: false, // if true, it will add a space between the number and the postfix
  showPlus: false,
};

export const formatDate = (ts: number) =>
  new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function shortenHash(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export const isInvalidNumber = (number: number | string | null | undefined) => {
  return (
    isNaN(Number(number)) ||
    number === "" ||
    number === null ||
    number === undefined ||
    number === NO_DATA_INDICATOR ||
    !Number.isFinite(Number(number)) ||
    Number(number) > 1e308
  );
};

export const getPrecisionBySignificantFigures = (value = 0, maxDigits = 3) => {
  if (!value) return 0;

  const absValue = Math.abs(value);

  if (absValue >= 1) {
    const intPartLength = String(Math.floor(absValue)).length;
    return Math.max(0, maxDigits - intPartLength);
  }

  const magnitude = Math.floor(Math.log10(absValue));
  return maxDigits - magnitude - 1;
};

export const getPrecisionByDigitsNumber = (number: string | number = "") => {
  const maxDigitsNumber =
    Math.abs(Number(number)) < 1
      ? Math.abs(Math.log10(MINIMUM_NUMBER)) + 1
      : MAX_SIGNIFICANT_FIGURES_NUMBER;
  const integerPart = number.toString().split(".")?.[0] ?? "";
  return Math.max(0, maxDigitsNumber - integerPart.length);
};

export const formatNumber = (
  number: string | number | null | undefined,
  customParams = {}
) => {
  const params = {...DEFAULT_FORMATTING_PARAMS, ...customParams};
  if (params.allowEmpty && number === "") {
    return "";
  }

  if (isInvalidNumber(number)) return NO_DATA_INDICATOR;

  const numericValue = isInvalidNumber(numeral(number).value())
    ? parseFloat(number as string)
    : numeral(number).value() ?? 0;

  const precision =
    params.precision === null
      ? getPrecisionByDigitsNumber(numericValue)
      : params.precision;

  let formattedNumber;
  const absNumber = Math.abs(numericValue);
  const isSmallNumber =
    Number(absNumber.toFixed(precision)) < MINIMUM_NUMBER && absNumber !== 0;

  const hasPrefix = params.prefix !== "";
  let signStr = "";
  if (numericValue !== null && numericValue !== 0) {
    signStr = numericValue < 0 ? "-" : params.showPlus ? "+" : "";
  }
  const prefixSpaced =
    hasPrefix && params.spaceBeforeNumber
      ? `${params.prefix} ${signStr}`
      : `${signStr}${params.prefix}`;
  const hasPostfix = params.postfix !== "";
  const postfixSpaced =
    hasPostfix && params.spaceAfterNumber
      ? ` ${params.postfix}`
      : params.postfix;

  if (params.showApproximation && isSmallNumber) {
    formattedNumber = `${prefixSpaced}0${postfixSpaced}`;
  } else {
    let format;
    if (precision === 0) {
      if (params.withAbbreviation) {
        format = `0,0a`;
      } else {
        format = `0,0`;
      }
    } else {
      if (params.withAbbreviation) {
        if (params.forcePrecision) {
          format = `0,0.${"0".repeat(precision)}a`;
        } else {
          format = `0,0[.][${"0".repeat(precision)}]a`;
        }
      } else {
        if (params.forcePrecision) {
          format = `0,0.${"0".repeat(precision)}`;
        } else {
          format = `0,0[.][${"0".repeat(precision)}]`;
        }
      }
    }

    formattedNumber = `${prefixSpaced}${numeral(absNumber).format(
      format
    )}${postfixSpaced}`;
  }

  return formattedNumber;
};
