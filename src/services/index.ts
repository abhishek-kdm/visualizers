import BarArray from '../BarArray';


export const BarArrayProvider = function(this: any) {

  this.generateBarArray = (arr: number[]): BarArray => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const array = new BarArray(canvas, arr);
    return array;
  }
};

