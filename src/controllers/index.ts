import Sorter from '../Sorter';


export const SortVisualizerCtrl = function(
  $scope: any,
  BarArrayProvider: any
) {
  const array = BarArrayProvider.generateBarArray();

  $scope.reshuffle = () => BarArrayProvider.reshuffle(array);
  $scope.reset = array.toInitialState.bind(array);

  $scope.options = [
    { label: 'Bubble Sort', value: 0 },
    { label: 'Insertion Sort', value: 1 },
    { label: 'Selection Sort', value: 2 },
  ];

  $scope.F = 0;
  $scope.sorters = [
    (() => { Sorter.bubbleSort(array); }),
    (() => { Sorter.insertionSort(array); }),
    (() => { Sorter.selectionSort(array); }),
  ];

}

