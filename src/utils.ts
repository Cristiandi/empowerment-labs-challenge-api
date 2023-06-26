export const approximateToTwoDecimals = (value: number) => {
  return Math.ceil(value * 100) / 100;
};
