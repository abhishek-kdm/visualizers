import BarArray from '../BarArray';

const { statements } = BarArray;

const insertionSort = async (array: BarArray) => {
  array.toInitialState();
  array.algorithm('Insertion Sort');

  await array.loop(1, array.length - 1, 1, async (i) => {
    await array.loop(i - 1, 0, -1, (j) => {
      if (array.valueAt(j) > array.valueAt(j + 1)) {
        array.swap(j, j + 1);
      } else {
        return statements.BREAK;
      }
    });
  });
  await array.completed();
};

export default insertionSort;

