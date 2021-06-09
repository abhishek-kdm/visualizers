// eslint-disable-next-line no-unused-vars
import Sorter, { SorterFunction } from '../Sorter';
import angular from 'angular';

import { randArray, jsonify } from '../utils';
import BarArray from '../BarArray';

export const VisualSortCtrl = function($scope: any) {

  $scope.states = Object.assign({}, BarArray.states);
  $scope.state = $scope.states.IDEAL;

  window.addEventListener(BarArray.stateEventName, (e: any) => {
    $scope.state = e.detail.state;
    $scope.$evalAsync();
  });

  $scope.array = [];
  $scope.arrayUpdater = (value: string) => angular.isDefined(value)
    ? ($scope.array = jsonify(value))
    : $scope.array.map(String).join(', ');

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const barArray = new BarArray(canvas, $scope.array);

  $scope.handlers = {
    reset: barArray.toInitialState.bind(barArray),

    randomize: () => {
      $scope.array = randArray(75);
      barArray.generateArray($scope.array);
      barArray.toInitialState();
    },

    sort: (funcName: string) => {
      barArray.generateArray($scope.array);
      (Sorter as { [name: string]: SorterFunction })[funcName](barArray);
    },
  }

  $scope.options = [
    { label: 'Bubble Sort', value: 'bubbleSort' },
    { label: 'Insertion Sort', value: 'insertionSort' },
    { label: 'Selection Sort', value: 'selectionSort' },
  ];
}

