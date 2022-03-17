'use strict';

export default class Label {
  align: string;
  text: string;
  size: number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;

  constructor(x: number, y: number, x0: number, y0: number, x1: number, y1: number, align: string) {
    this.x = x;
    this.y = y;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.align = align;
    this.text = '';
    this.size = 18;
  }
}
