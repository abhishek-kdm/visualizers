import angular from 'angular';

import { VisualSortCtrl } from './controllers';

const app = angular.module('VisualSortApp', []);

app.controller('VisualSortCtrl', ['$scope', VisualSortCtrl]);

