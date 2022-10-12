export class BinaryHeapStrategy {
  constructor(options) {
    let ref;
    this.comparator = (options != null ? options.comparator : void 0) || function (a, b) {
      return a - b;
    };
    this.length = 0;
    this.data = ((ref = options.initialValues) != null ? ref.slice(0) : void 0) || [];
    this._heapify();
  }
  length = 0;
  data = []

  _heapify = function () {
    let i, j, ref;
    if (this.data.length > 0) {
      for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        this._bubbleUp(i);
      }
    }
    return void 0;
  };
  comparator = function (a, b) {
    return a - b;
  };

  queue = function (value) {
    this.data.push(value);
    this._bubbleUp(this.data.length - 1);
    return void 0;
  };

  dequeue = function () {
    const ret = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return ret;
  };

  peek = function () {
    return this.data[0];
  };

  clear = function () {
    this.length = 0;
    this.data.length = 0;
    return void 0;
  };

  _bubbleUp = function (pos) {
    let parent, x;
    while (pos > 0) {
      parent = (pos - 1) >>> 1;
      if (this.comparator(this.data[pos], this.data[parent]) < 0) {
        x = this.data[parent];
        this.data[parent] = this.data[pos];
        this.data[pos] = x;
        pos = parent;
      } else {
        break;
      }
    }
    return void 0;
  };

  _bubbleDown = function (pos) {
    let left, minIndex, right, x;
    const last = this.data.length - 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
        minIndex = left;
      }
      if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
        minIndex = right;
      }
      if (minIndex !== pos) {
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      } else {
        break;
      }
    }
    return void 0;
  };
}