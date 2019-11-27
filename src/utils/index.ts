declare global {
  interface Array<T> { clear(): void; }
}

Array.prototype.clear = function() {
  this.splice(0, this.length);
}


export const sleep = (
  ms: number
): Promise<void> => new Promise((fn) => setTimeout(fn, ms));

export const randInt = (
  min: number,
  max: number
): number => Math.floor(Math.random() * (max - min + 1)) + min;

