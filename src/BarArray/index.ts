import { sleep } from '../utils';

const DEFAULT_START_X: number = 10;
const DEFAULT_START_Y: number = 500;
const DEFAULT_BAR_WIDTH: number = 10;
const DEFAULT_BAR_SPACING: number = 4;
// const DELAY: number = 100; // in ms.

type Statement = 'break' | 'continue' | void;

export interface Bar {
  value: number
  color: string
}

interface BarArrayLoopOptions {
  colors?: { done?: string, processing?: string }
}

interface BarArrayDrawingOptions {
  start_x: number
  start_y: number
  width: number
  spacing: number
}

interface BarArrayStats { [stats: string]: string | null }


class BarArray {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  array: number[];
  barArray: Bar[];

  private drawingOptions: BarArrayDrawingOptions = {
    // starting (x, y) on canvas.
    start_x: DEFAULT_START_X,
    start_y: DEFAULT_START_Y,
    
    // width and spacing between bars.
    width: DEFAULT_BAR_WIDTH,
    spacing: DEFAULT_BAR_SPACING,
  };

  // delay in animation (ms).
  // private delay = DELAY;


  private statistics: BarArrayStats = {
    // current algorithm.
    algo: null,
    prinary: null,
    secondary: null,
  }

  constructor(canvas: HTMLCanvasElement, array: number[]) {
    // canvas and context (initialize).
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // initializing both arrays.
    this.array = array;
    this.barArray = [];

    // reset canvas and generate the bar array.
    this.resetCanvas();
    this.generateArray(array);

    document.addEventListener('resize', this.resetCanvas);
  }

  // generating array and scaled array to match the canvas size.
  generateArray(array: number[]) {
    this.array = array || this.array;
    this.generateBarArray();
  }

  // Scale the array values to match the canvas size and the array bars.
  generateBarArray() {
    let scalingValue = this.array
      .reduce((a, b) => Math.max(a, b), this.array[0]);

    // adding offset 10% to the scaling value (max of the array).
    scalingValue += Math.floor(scalingValue * 0.1);

    // The new value, to which the elements in the array needs to scale to.
    // with 7% negative offset as we want some padding with the canvas borders.
    const { start_y } = this.drawingOptions;

    const scaleTo = start_y - Math.floor(start_y * 0.07);
    this.barArray = this.array.map((v) => ({
      value: Math.floor((v * scaleTo) / scalingValue),
      color: 'black',
    }));
  }

  // only resets the canvas.
  // does not redraws the bar array.
  resetCanvas() {
    // trying to make it responsive.
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';

    const { offsetWidth, offsetHeight } = this.canvas;
    this.canvas.width = offsetWidth;
    this.canvas.height = offsetHeight;

    // center the axis, for proper visual (support for negative numbers).
    this.drawingOptions.start_y = Math.floor(offsetHeight / 2);


    // trying to make the visual bar array, responsive.
    const { spacing } = this.drawingOptions;

    const _spacing = (spacing * this.length);
    const borders = (DEFAULT_START_X * 2) - spacing;
    this.drawingOptions.width = Math.floor(
      (offsetWidth - borders - _spacing) / this.length
    );
    // black border around canvas.
    this.drawRect('black', 0, 0, offsetWidth, offsetHeight, 1);
    this.drawStatusBar();
  }

  // pretty standard rect draw for canvas.
  drawRect(
    color: string,
    x: number,
    y: number,
    width: number,
    height: number,
    lineWidth?: number
  ) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    if (lineWidth) {
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    } else {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }

  // draws the array on canvas with the current `barArray` measures.
  drawArray() {
    const { start_x, start_y, width, spacing } = this.drawingOptions;

    for (let i = 0; i < this.length; i++) {
      const element = this.barArray[i];
      const w = width;
      const h = element.value;
      const x = ((spacing + width) * i) + start_x;
      const y = start_y - h;
      this.drawRect(element.color, x, y, w, h);
    }
  }

  drawStatusBar(): void {
    const stats: string[] = Object.keys(this.statistics)
      .reduce((acc: string[], key: string) => {
        if (this.statistics[key])
          acc.push(`${key}: ${this.statistics[key]}`);
        return acc;
      }, []);

    this.fillText(stats.join(' | '), 12, 12);
  }

  fillText(text: string, x: number, y: number) {
    const { fillStyle } =  this.ctx;
    this.ctx.font = '12px Courier';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(text, x, y);
    this.ctx.fillStyle = fillStyle;
  }

  swap(i: number, j: number) {
    let t = this.barArray[i];
    this.barArray[i] = this.barArray[j];
    this.barArray[j] = t;
  }

  async loop(
    _from: number,
    to: number,
    inc: number,
    f: (i: number) => Statement | Promise<Statement>,
    options: BarArrayLoopOptions = {}
  ) {

    const { colors } = options;
    const { processing, done } = colors || {};

    for (let i = _from; inc > 0 ? i <= to : i >= to; i += inc) {

      // @TODO remove index painting from here to `valueAt` method
      // as that seems too convenient and scalable.
      if (i != _from) this.doneProcessingIndex(i - inc, done);
      this.processingIndex(i, processing);

      const statement = await f(i);

      if (statement === BarArray.statements.BREAK) break;
      if (statement === BarArray.statements.CONTINUE) continue;

      // delay for better visual.
      await sleep(25);
    }
  }


  async completed() {
    await sleep(50);
    for (let i = 0; i < this.length; i++) {
      this.paint([i], BarArray.colors.COMPLETED);
      await sleep(10);
    }
  }

  processingIndex(i: number, color = BarArray.colors.PROCESSING) {
    this.paint([i], color);
  }

  doneProcessingIndex(i: number, color = BarArray.colors.IDEAL) {
    if (i >= 0 && i < this.length) this.paint([i], color);
  }

  valueAt(i: number) {
    return this.barArray[i].value;
  }

  // changes color of the given bars and redraws the canavs.
  // @TODO: need optimization here (maybe) or just avoid 
  // exessive painting in code.
  paint(xs: number[], color: string) {
    this.resetCanvas();
    for (let x of xs) {
      this.barArray[x].color = color;
    }
    this.drawArray();
  }

  public get length(): number {
    return this.array.length;
  }

  public set setAlgo(v: string) {
    this.statistics.algo = v;
  }


  // statics.
  static statements: { [s: string]: Statement } = {
    BREAK: 'break',
    CONTINUE: 'continue',
  };

  static colors: { [c: string]: string } = {
    IDEAL: 'black',
    PROCESSING: 'grey',
    DONE: 'dodgerblue',
    COMPLETED: 'lightpink',
  };

}



export default BarArray;


