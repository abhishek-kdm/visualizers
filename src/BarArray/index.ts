import { BarArray } from './BarArray';
import { sleep } from '../utils';


declare module './BarArray' {
  interface BarArray {
    valueAt(i: number): number;
    swap(i: number, j: number): void;

    loop(
      _from: number,
      to: number,
      inc: number,
      f: (i: number) => Statement | Promise<Statement>
    ): Promise<void>;
  }
}


// provides with the value at a index and colors respective bar.
// @TODO doesnt de-color the previous one though.
BarArray.prototype.valueAt = function(i: number): number {
  this.paint([i], BarArray.colors.PROCESSING);
  this.previous.push(i);

  // increment N if exists or set it to 1;
  const { N } = this.statistics;
  this.statistics.N = String(parseInt(N || '0', 10) + 1);

  return this.barArray[i].value;
}


// swapping numbers in the barArray as well as updating the previous
// array for visuals.
BarArray.prototype.swap = function(i: number, j: number) {
  const t = this.barArray[i];
  this.barArray[i] = this.barArray[j];
  this.barArray[j] = t;

  // replacing the index with new one, if present in
  // the `previous` array.
  for (let index = 0; index < this.previous.length; index++) {
    const e = this.previous[index];
    if (e === i || e === j) {
      this.previous[index] = i + j - e;
    } 
  }
}


BarArray.prototype.loop = async function(_from, to, inc, f) {
  for (let i = _from; inc > 0 ? i <= to : i >= to; i += inc) {
    const statement = await f(i);
    // delay for better visual.
    await sleep(25);

    // @TODO somehow manage this in the `valueAt` method.
    this.paint(this.previous, BarArray.colors.IDEAL);
    this.previous.clear();

    if (statement === BarArray.statements.BREAK) break;
    if (statement === BarArray.statements.CONTINUE) continue;
  }
  this.paint(this.previous, BarArray.colors.IDEAL);
  this.previous.clear();

}



export default BarArray;


