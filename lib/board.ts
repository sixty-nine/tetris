import { TileColor, Position, Matrix4x4, FullLineCallback, callFunction } from './types';

export class Board {

  public readonly width: number;
  public readonly height: number;
  private readonly board: Array<Array<TileColor>>;

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
      this.clearLine(j);
    }
  }

  private clearLine(line: number) {
    for (let i = 0; i < this.width; i++) {
      this.board[line][i] = 0;
    }
  }

  public isInside(p: Position) {
    const [x, y] = p;
    return x >= 0 && x < this.width
      && y >= 0 && y < this.height;
  }

  public getContent(p: Position): TileColor {
    const [x, y] = p;
    return this.board[y][x];
  }

  public setContent(p: Position, val: TileColor) {
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

  private isLineFull(line: number): boolean {

    if (line < 0 || line >= this.height) {
      return false;
    }

    for (let i = 0; i < this.width; i++) {
      if (this.board[line][i] === 0) {
        // If we find an empty block then the line is not full
        return false;
      }
    }

    return true;
  }

  private removeLine(line: number): void {
    if (line <= 0 || line >= this.height) {
      return;
    }

    for (let i = line; i > 0; i--) {
      this.board[i] = this.board[i - 1];
    }
    this.board[0] = new Array(this.width);
    this.clearLine(0);
  }

  public scanFullLines(onFullLine?: FullLineCallback) {
    let j = this.height - 1;
    while (j > 0) {
      if (this.isLineFull(j)) {
        callFunction(onFullLine, j);
        this.removeLine(j);
      } else {
        j -= 1;
      }
    }
  }

  public merge(s: Matrix4x4, p: Position, color: number = 1) {
    const [x, y] = p;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (s[j][i]) {
          if (this.isInside([x + i, y + j])) {
            this.setContent([x + i, y + j], color);
          }
        }
      }
    }
  }
}
