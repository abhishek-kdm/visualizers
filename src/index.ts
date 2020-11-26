import angular from 'angular';

import { VisualSortCtrl } from './controllers';
import { BarArrayProvider } from './services';

const app = angular.module('VisualSortApp', []);

app.service('BarArrayProvider', BarArrayProvider);

app.controller('VisualSortCtrl', [
  '$scope',
  'BarArrayProvider',
  VisualSortCtrl
]);

