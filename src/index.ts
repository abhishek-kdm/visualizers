import angular from 'angular';

import { SortVisualizerCtrl } from './controllers';
import { BarArrayProvider } from './services';

const app = angular.module('VisualizerApp', []);

app.service('BarArrayProvider', BarArrayProvider);

app.controller('SortVisualizerCtrl', [
  '$scope',
  'BarArrayProvider',
  SortVisualizerCtrl
]);

