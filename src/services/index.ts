import BarArray from '../BarArray';
import { randArray } from '../utils';


export const BarArrayProvider = function(this: any) {

  this.generateBarArray = function() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const arr = randArray(34);

    const array = new BarArray(canvas, arr);
    return array;
  }

  this.reshuffle = (array: BarArray) => {
    array.generateArray(randArray(34));
    array.toInitialState();
  }
};

