// eslint-disable-next-line no-unused-vars
import Sorter, { SorterFunction } from '../Sorter';
import angular from 'angular';

import { randArray, jsonify } from '../utils';
import BarArray from '../BarArray';


export const SortVisualizerCtrl = function(
  $scope: any,
  BarArrayProvider: any
) {

  $scope.states = Object.assign({}, BarArray.states);
  $scope.state = $scope.states.IDEAL;

  window.addEventListener(BarArray.stateEventName, (e: any) => {
    $scope.state = e.detail.state;
    $scope.$evalAsync();
  });

  $scope.array = [];
  $scope.arrayUpdater = (value: string) => angular.isDefined(value) ?
    ($scope.array = jsonify(value)) : $scope.array.map(String).join(', ');


  const array = BarArrayProvider.generateBarArray($scope.array);

  $scope.handlers = {
    reset: array.toInitialState.bind(array),

    randomize: () => {
      $scope.array = randArray(75);
      array.generateArray($scope.array);
      array.toInitialState();
    },

    sort: (funcName: string) => {
      array.generateArray($scope.array);
      (Sorter as { [name: string]: SorterFunction })[funcName](array);
    },
  }

  $scope.F = 'bubbleSort';
  $scope.options = [
    { label: 'Bubble Sort', value: 'bubbleSort' },
    { label: 'Insertion Sort', value: 'insertionSort' },
    { label: 'Selection Sort', value: 'selectionSort' },
  ];


}

