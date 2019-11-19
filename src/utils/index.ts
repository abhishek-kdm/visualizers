import BarArray from '../BarArray';

export const sleep = (
  ms: number
): Promise<void> => new Promise((fn) => setTimeout(fn, ms));

export const randInt = (
  min: number,
  max: number
): number => Math.floor(Math.random() * (max - min + 1)) + min;

