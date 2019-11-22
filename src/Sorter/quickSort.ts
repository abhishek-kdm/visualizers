import BarArray from '../BarArray';
// import { sleep } from '../utils';

// const closestToMean = (array: Bar[]) => {
//   const mean = array.reduce((a, b) => a + b.value, 0);
//   let index = 0;
//   let closest = Math.abs(mean - array[index].value);
//   for (let i = 1; i < array.length; i++) {
//     const num = Math.abs(mean - array[i].value);
//     if (num < closest) {
//       closest = num;
//       index = i;
//     }
//   }
//   return index;
// }

// slightly modified slower quicksort version for better visuals.
const partition = async (array: BarArray, low: number, high: number) => {
  // let pivot = closestToMean(array.barArray);
  // console.log(pivot, array.valueAt(pivot));
  // array.swap(pivot, low);
  // pivot = low;
  // for (let i = pivot + 1; i <= high; i++) {
  //   array.doneProcessingIndex(i - 1);
  //   array.processingIndex(i);
  //   if (array.valueAt(i) < array.valueAt(pivot)) {
  //     await array.cycleRight(i, pivot);
  //     pivot++;
  //   }
  //   array.paint([pivot], 'green');
  //   await sleep(100);
  // }
  // array.doneProcessingIndex(pivot);
  console.log(array, low);
  return high;
}

const quickSort = async (array: BarArray, low: number, high: number) => {
  // terminator.
  if (low >= high) return;

  const pivot = await partition(array, low, high);
  // return;
  await quickSort(array, low, pivot - 1);
  await quickSort(array, pivot + 1, high);

  await array.completed();
}


export default quickSort;

