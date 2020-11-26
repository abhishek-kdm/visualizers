// eslint-disable-next-line no-unused-vars
import BarArray from '../BarArray';

const bubbleSort = async (array: BarArray) => {
  array.toInitialState();
  array.algorithm('Bubble Sort');

  await array.loop(array.length - 1, 1, -1, async (i) => {
    await array.loop(0, i - 1, 1, (j) => {
      if (array.valueAt(j) > array.valueAt(j + 1)) {
        array.swap(j, j + 1);
      }
    });
  });
  await array.completed();
}

export default bubbleSort;

