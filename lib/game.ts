import { Board } from './board';
import { randomTile } from './tiles';
import { Position, Piece } from './types';
import { randomPositive } from './helpers';


export class Game {

  private gameOver: boolean = false;
  public readonly board: Board;
  public currentPiece?: Piece;
  public currentPosition: Position = [0, 0];

  constructor() {
    const width = 15;
    const height = 30;
    this.board = new Board(width, height);
  }

  private newPiece() {
    this.currentPiece = new Piece(randomTile(), randomPositive(0, 3));
    this.currentPosition = [Math.floor((this.board.width - 4) / 2), 0];
  }

  private canMoveDown() {
    if (!this.currentPiece) {
      return false;
    }
    const [x, y] = this.currentPosition;
    return !this.board.hasCollisions([x, y + 1], this.currentPiece.getShape());
  }

  private canMoveLeft() {
    if (!this.currentPiece) {
      return false;
    }
    const [x, y] = this.currentPosition;
    return !this.board.hasCollisions([x - 1, y], this.currentPiece.getShape());
  }

  private canMoveRight() {
    if (!this.currentPiece) {
      return false;
    }
    const [x, y] = this.currentPosition;
    return !this.board.hasCollisions([x + 1, y], this.currentPiece.getShape());
  }

  public isGameOver = (): boolean => this.gameOver;

  public rotateLeft() {
    if (!this.currentPiece) {
      return;
    }

    this.currentPiece.rotateLeft();
    if (this.board.hasCollisions(this.currentPosition, this.currentPiece.getShape())) {
      this.currentPiece.rotateRight();
    }
  }

  public rotateRight() {
    if (!this.currentPiece) {
      return;
    }

    this.currentPiece.rotateRight();
    if (this.board.hasCollisions(this.currentPosition, this.currentPiece.getShape())) {
      this.currentPiece.rotateLeft();
    }
  }

  public moveLeft() {
    if (this.canMoveLeft()) {
      this.currentPosition[0] = this.currentPosition[0] - 1;
    }
  }

  public moveRight() {
    if (this.canMoveRight()) {
      this.currentPosition[0] = this.currentPosition[0] + 1;
    }
  }

  public run() {

    if (!this.currentPiece) {
      this.newPiece();
      return;
    }

    if (this.canMoveDown()) {
      this.currentPosition[1] += 1;
    } else {
      if (this.currentPosition[1] === 0) {
        this.gameOver = true;
      }
      this.board.merge(this.currentPiece.getShape(), this.currentPosition);
      this.board.scanFullLines();
      this.newPiece();
    }

  }
}
