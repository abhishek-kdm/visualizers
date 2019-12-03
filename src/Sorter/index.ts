import bubbleSort from './bubbleSort';
import insertionSort from './insertionSort';
import selectionSort from './selectionSort';
import BarArray from '../BarArray';
// import quickSort from './quickSort';

export type SorterFunction = (array: BarArray) => Promise<void>;

export default {
  bubbleSort,
  insertionSort,
  selectionSort,
  // quickSort
};

