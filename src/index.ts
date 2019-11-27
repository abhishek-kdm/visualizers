import BarArray from './BarArray';
import { randInt } from './utils';

import Sorter from './Sorter';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

let arr: number[] = [];
for (let i = 0; i < 34; ++i) {
  arr.push(randInt(10, 99));
}

const array = new BarArray(canvas, arr);
array.drawArray();

(window as any).bubbleSort = () => { Sorter.bubbleSort(array); }
(window as any).insertionSort = () => { Sorter.insertionSort(array); }
(window as any).selectionSort = () => { Sorter.selectionSort(array); }

(window as any).reset = array.toInitialState.bind(array);

