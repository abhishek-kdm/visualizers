import {
  DEFAULT_START_X,
  DEFAULT_START_Y,
  DEFAULT_BAR_WIDTH,
  DEFAULT_BAR_SPACING
} from '../constants';
import { sleep } from '../utils';

export class BarArray {
  initialArray: number[];
  barArray: Bar[];

  // keeping track of the indices accessed, for highlighting purposes.
  previous: any[] = [];

  // stats for statusbar.
  statistics: BarArrayStats = {};

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private drawingOptions: BarArrayDrawingOptions = {
    // starting (x, y) on canvas.
    start_x: DEFAULT_START_X,
    start_y: DEFAULT_START_Y,

    // width and spacing between bars.
    width: DEFAULT_BAR_WIDTH,
    spacing: DEFAULT_BAR_SPACING,
  };


  static statements: { [s: string]: Statement } = {
    BREAK: 'break',
    CONTINUE: 'continue',
  };

  static colors: { [c: string]: string } = {
    IDEAL: 'black',
    PROCESSING: 'red',
    DONE: 'dodgerblue',
    COMPLETED: 'dodgerblue',
  };

  constructor(canvas: HTMLCanvasElement, initialArray: number[]) {
    // canvas and context initialization.
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // initializing both arrays.
    this.initialArray = initialArray;
    this.barArray = [];

    // reset everything to initial state.
    this.toInitialState();

    document.addEventListener('resize', this.resetCanvas);
  }

  toInitialState(): void {
    // stats to null
    this.statistics = {};

    // reset canvas and return array to initial state.
    this.resetCanvas();
    this.generateArray(this.initialArray);

    this.previous.clear();

    // finally draw the bar array on the canvas.
    this.drawArray();
  }


  // generating initialArray and scaled array to match the
  // canvas size.
  generateArray(initialArray?: number[]): void {
    this.initialArray = initialArray || this.initialArray;
    this.generateBarArray();
  }

  // Scale the array values to match the canvas size and the
  // array bars.
  generateBarArray(): void {
    // maximum of the array.
    let scalingValue = this.initialArray
      .reduce((a, b) => Math.max(a, b), this.initialArray[0]);

    // adding offset 10% to the scaling value (max of the array).
    scalingValue += Math.floor(scalingValue * 0.1);

    // The new value, to which the elements in the array
    // needs to scale to.
    // with 7% negative offset as we want some padding with the
    // canvas borders.
    const { start_y } = this.drawingOptions;

    const scaleTo = start_y - Math.floor(start_y * 0.07);
    this.barArray = this.initialArray.map((v) => ({
      value: Math.floor((v * scaleTo) / scalingValue),
      color: 'black',
    }));
  }

  // only resets the canvas.
  // does not redraws the bar array.
  resetCanvas(): void {
    // trying to make it responsive.
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';

    const { offsetWidth, offsetHeight } = this.canvas;
    this.canvas.width = offsetWidth;
    this.canvas.height = offsetHeight;

    // setting y as the center the axis,
    // for proper visual (support for negative numbers).
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
    lineWidth?: number // in case of drawing a bordered box.
  ): void {
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
  drawArray(): void {
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

    this.drawText(stats.join(' | '), 12, 12);
  }

  drawText(text: string, x: number, y: number): void {
    const { fillStyle } =  this.ctx;
    this.ctx.font = '12px Courier';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(text, x, y);
    this.ctx.fillStyle = fillStyle;
  }

  // changes color of the given bars and redraws the canavs.
  // @TODO: need optimization here (maybe) or just avoid 
  // exessive painting in code.
  paint(xs: number[], color: string): void {
    this.resetCanvas();
    for (let x of xs) {
      this.barArray[x].color = color;
    }
    this.drawArray();
  }

  async completed(): Promise<void> {
    await sleep(50);
    for (let i = 0; i < this.length; i++) {
      this.paint([i], BarArray.colors.COMPLETED);
      await sleep(10);
    }
  }

  // getters setters.
  public get length(): number {
    return this.initialArray.length;
  }

  public set setAlgo(v: string) {
    this.statistics.A = v;
  }
}


