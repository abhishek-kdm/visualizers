import Canvas from './Canvas';
import { sleep } from '../utils';
import { DEFAULT_START_X, DEFAULT_STATISTICS } from '../constants';

export class BarArray extends Canvas {
  public static statements: { [s: string]: Statement } = {
    BREAK: 'break',
    CONTINUE: 'continue',
  };

  public static colors: { [c: string]: string } = {
    IDEAL: 'white',
    PROCESSING: 'red',
    COMPLETED: 'yellow',
  };

  public static states: { [c: string]: State } = {
    IDEAL: 1,
    BUSY: 0,
  };

  public static stateEventName: string = 'BarArrayStateEvent';

  public initialArray: number[];
  public barArray: Bar[];

  // keeping track of the indices accessed, for highlighting purposes.
  public previous: any[] = [];

  private state: State = BarArray.states.IDEAL;

  // stats for statusbar.
  stats: BarArrayStats = { ...DEFAULT_STATISTICS };

  constructor(canvas: HTMLCanvasElement, initialArray: number[]) {
    super(canvas);

    // initializing both arrays.
    this.initialArray = initialArray;
    this.barArray = [];

    // reset everything to initial state.
    this.toInitialState();
  }

  reset() {
    this.resetCanvas();
    const { offsetWidth, offsetHeight } = this.canvas;
    // setting y as the center the axis,
    // for proper visual (support for negative numbers).
    this.drawingOptions.start_y = Math.floor(offsetHeight / 2);

    // trying to make the visual bar array, responsive.
    const { spacing, statsBarOffset } = this.drawingOptions;

    const space = spacing * this.length;
    const borders = DEFAULT_START_X * 2 - spacing;
    this.drawingOptions.width = Math.floor(
      (offsetWidth - borders - space - statsBarOffset) / this.length
    );
    this.drawStatusBar();
  }

  public toInitialState(): void {
    // stats to null
    this.stats = Object.assign({}, DEFAULT_STATISTICS);

    // reset canvas and array to initial state.
    this.reset();
    this.generateArray(this.initialArray);

    // clear list of previously saved indices.
    this.previous.clear();

    // reset BarArray state to `IDEAL`.
    this.setState(BarArray.states.IDEAL);

    // finally draw the bar array on the canvas.
    this.drawArray();
  }

  // to keep track of the current state of the array (if painting or
  // ideal) for the purpose of disabling multiple methods trying to
  // update something while some async operation is going on.
  setState(state: State) {
    // return if there is no change of state.
    if (this.state === state) return;

    // change the `state` value for the current object.
    this.state = state;

    // dispatch state event.
    this.canvas.dispatchEvent(
      new CustomEvent(BarArray.stateEventName, {
        detail: { state },
        bubbles: true,
        cancelable: true,
      })
    );
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
    let scalingValue = this.initialArray.reduce(
      (a, b) => Math.max(a, b),
      this.initialArray[0]
    );

    // adding offset 10% to the scaling value (max of the array).
    scalingValue += Math.floor(scalingValue * 0.1);

    // The new value, to which the elements in the array
    // needs to scale to.
    // with 7% negative offset as we want some padding with the
    // canvas borders.
    const { start_y } = this.drawingOptions;

    const scaleTo = start_y - Math.floor(start_y * 0.07);
    this.barArray = this.initialArray.map((v) => ({
      initialValue: v,
      value: Math.floor((v * scaleTo) / scalingValue),
      color: BarArray.colors.IDEAL,
    }));

    this.stats.Length = this.length.toString();
  }

  // draws the array on canvas with the current `barArray` measures.
  drawArray(): void {
    const { start_x, start_y, width, spacing, statsBarOffset } =
      this.drawingOptions;

    for (let i = 0; i < this.length; i++) {
      const element = this.barArray[i];
      const w = width;
      const h = element.value;
      const x = (spacing + width) * i + start_x + statsBarOffset;
      const y = start_y - h;
      this.drawRect(element.color, x, y, w, h);

      const text_y = y - 5;
      this.drawText(String(element.initialValue), x, text_y, 'dodgerblue');
    }
  }

  drawStatusBar(): void {
    const keys = Object.keys(this.stats).sort();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.stats[key] || '';

      const y = 12 * (i + 1) + 15 * (i + 1);
      this.drawText(key, 12, y);
      this.drawText(value || '--', 12, y + 15, '#26FF94');
    }
  }

  // changes color of the given bars and redraws the canavs.
  // @TODO: need optimization here (maybe) or just avoid
  // exessive painting in code.
  paint(xs: number[], color: string): void {
    this.reset();
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

    // dispatching event `sorterState`
    this.setState(BarArray.states.IDEAL);
  }

  public get length(): number {
    return this.initialArray.length;
  }

  public algorithm(a: string) {
    this.stats.Algorithm = a;
  }
}
