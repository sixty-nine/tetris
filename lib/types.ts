import { randomTile } from '~/lib/tiles';
import { randomPositive } from '~/lib/helpers';
import { Board } from '~/lib/board';

export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };

export type TileColor = number;

export type Position = Tuple<number, 2>;

// A 4x4 matrix of TileColor
type Row = Tuple<TileColor, 4>;
export type Matrix4x4 = Tuple<Row, 4>;

// Four rotations of a Matrix4x4
export type Tile = Tuple<Matrix4x4, 4>;

export type FullLineCallback = (line: number) => void;
export type GameOverCallback = () => void;
export type NewPieceCallback = (curPiece: Piece, nextPiece: Piece) => void;
export type BoardChangedCallback = () => void;

// Call the given function with the given arguments ONLY if the function is defined.
export const callFunction = (fct?: Function, ...args: unknown[]) =>
  fct && fct(...args)
;

export class Piece {
  private readonly tile: Tile;
  private _curRotation;
  private _name: string;

  constructor(name: string, tile: Tile, curRotation = 0) {
    this.tile = tile;
    this._curRotation = curRotation;
    this._name = name;
  }

  get curRotation() {
    return this._curRotation;
  }

  get name() {
    return this._name;
  }

  public static randomPiece(): Piece {
    const r = randomTile();
    return new Piece(r.name, r.tile, randomPositive(0, 3));
  };

  public getShape = (): Matrix4x4 => this.tile[this._curRotation];

  public rotateLeft = () => {
    this._curRotation = this._curRotation > 0 ? this._curRotation - 1 : 3;
  };

  public rotateRight = () => {
    this._curRotation = this._curRotation < 3 ? this._curRotation + 1 : 0;
  };

}
