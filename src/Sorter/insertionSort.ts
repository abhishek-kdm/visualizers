import BarArray from '../BarArray';


const { colors, statements } = BarArray;

const insertionSort = async (array: BarArray) => {
  await array.loop(1, array.length - 1, 1, async (i) => {

    await array.loop(i - 1, 0, -1, (j) => {

      if (array.valueAt(j) > array.valueAt(j + 1)) {
        array.swap(j, j + 1);
      } else {
        return statements.BREAK;
      }

    }, { colors: { done: colors.DONE, processing: colors.DONE } });

  }, { colors: { done: colors.PROCESSING, processing: colors.PROCESSING } });
  await array.completed();
}


export default insertionSort;

