import { OnOff, Position, Matrix4x4 } from './types';


export class Board {

  public readonly width: number;
  public readonly height: number;
  private readonly board: Array<Array<OnOff>>;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;

    this.board = new Array(this.height);
    for (let j = 0; j < this.height; j++) {
      this.board[j] = new Array(this.width);
    }

    this.clear();
  }

  public clear() {
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        this.board[j][i] = 0;
      }
    }
  }

  public isInside(p: Position) {
    const [x, y] = p;
    return x >= 0 && x < this.width
      && y >= 0 && y < this.height;
  }

  public getContent(p: Position): OnOff {
    const [x, y] = p;
    return this.board[y][x];
  }

  public setContent(p: Position, val: OnOff) {
    const [x, y] = p;
    this.board[y][x] = val;
  }

  public hasCollisions(p: Position, s: Matrix4x4) {
    const [x, y] = p;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const boardPos: Position = [x + i, y + j];
        const isShapeSet = s[j][i];

        if (!this.isInside(boardPos)) {
          if (isShapeSet) {
            // The shape touches outside of the board
            return true;
          }

          // Another non-touching outside-of-the-board position
          continue;
        }

        if (isShapeSet && this.getContent(boardPos)) {
          // Collision between the board background and the shape
          return true;
        }
      }
    }

    // No collision
    return false;
  }

  public merge(s: Matrix4x4, p: Position) {
    const [x, y] = p;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (s[j][i]) {
          if (this.isInside([x + i, y + j])) {
            this.setContent([x + i, y + j], 1);
          }
        }
      }
    }
  }
}
