import BarArray from '../BarArray';


const { colors } = BarArray;

const selectionSort = async (array: BarArray) => {
  const len = array.length;

  await array.loop(0, len - 2, 1, async (i) => {
    let minIndex = i;

    await array.loop(i, len - 1, 1, (j) => {
      if (array.valueAt(j) < array.valueAt(minIndex))
        minIndex = j;
    });

    array.swap(i, minIndex);

    // edge case (can't help it).
    array.paint([len - 1], colors.IDEAL)

  });

  await array.completed();
}


export default selectionSort;

