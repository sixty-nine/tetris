export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };

export type OnOff = 0 | 1;

export type Position = Tuple<number, 2>;

// A 4x4 matrix of OnOff
type Row = Tuple<OnOff, 4>;
export type Matrix4x4 = Tuple<Row, 4>;

// Four rotations of a Matrix4x4
export type Tile = Tuple<Matrix4x4, 4>;


export type ForEachCallback = (x: number, y: number, shape: Matrix4x4) => void;

export class Shape {
  public readonly shape: Matrix4x4;

  constructor(shape: Matrix4x4) {
    this.shape = shape;
  }

  public forEach = (callback: ForEachCallback) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        callback(i, j, this.shape);
      }
    }
  }
}

export class Piece {
  private readonly tile: Tile;
  private _curRotation;

  constructor(tile: Tile, curRotation = 0) {
    this.tile = tile;
    this._curRotation = curRotation;
  }

  get curRotation() {
    return this._curRotation;
  }

  public getShape = (): Matrix4x4 => this.tile[this._curRotation];

  public rotateLeft = () => {
    this._curRotation = this._curRotation > 0 ? this._curRotation - 1 : 3;
  }

  public rotateRight = () => {
    this._curRotation = this._curRotation < 3 ? this._curRotation + 1 : 0;
  }

}
