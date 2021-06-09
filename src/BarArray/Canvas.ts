import {
  DEFAULT_START_X,
  DEFAULT_START_Y,
  DEFAULT_BAR_WIDTH,
  DEFAULT_BAR_SPACING,
} from '../constants';

const darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;

export default class Canvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  protected drawingOptions: BarArrayDrawingOptions = {
    // starting (x, y) on canvas.
    start_x: DEFAULT_START_X,
    start_y: DEFAULT_START_Y,

    // width and spacing between bars.
    width: DEFAULT_BAR_WIDTH,
    spacing: DEFAULT_BAR_SPACING,

    statsBarOffset: 100,
    textSize: 10,
  };

  constructor(canvas: HTMLCanvasElement) {
    // canvas and context initialization.
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
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

    this.drawRect(darkmode ? '#0a0a0a' : '#dedede', 0, 0, offsetWidth, offsetHeight);
    // border.
    this.drawRect(darkmode ? '#aaaaaa' : '#292929', 0, 0, offsetWidth, offsetHeight, 1);
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

  drawText(text: string, x: number, y: number, color?: string): void {
    const { fillStyle } = this.ctx;
    this.ctx.font = `bold ${this.drawingOptions.textSize}px Monospace`;
    this.ctx.fillStyle = color || '#1D6640';
    this.ctx.fillText(text, x, y);
    this.ctx.fillStyle = fillStyle;
  }
}
