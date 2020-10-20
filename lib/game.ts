import { Board } from './board';

import {

  Position,
  Piece,
  FullLineCallback,
  GameOverCallback,
  NewPieceCallback,
  BoardChangedCallback,
  callFunction

} from './types';

export type GameConfig = {
  onFullLine?: FullLineCallback,
  onGameOver?: GameOverCallback,
  onNewPiece?: NewPieceCallback,
  onBoardChanged?: BoardChangedCallback,
}

export class Game {

  private gameOver: boolean = false;
  public readonly board: Board;
  public currentPiece?: Piece;
  public nextPiece?: Piece;
  public currentPosition: Position = [0, 0];
  private config: GameConfig;

  constructor(config: GameConfig) {
    const width = 10;
    const height = 20;
    this.board = new Board(width, height);
    this.config = config;
  }

  private newPiece() {
    if (!this.nextPiece) {
      this.nextPiece = Piece.randomPiece();
    }

    this.currentPiece = this.nextPiece;
    this.nextPiece = Piece.randomPiece();

    this.currentPosition = [Math.floor((this.board.width - 4) / 2), 0];

    callFunction(this.config.onNewPiece, this.currentPiece, this.nextPiece);
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

    if (this.gameOver) {
      return;
    }

    if (!this.currentPiece) {
      this.newPiece();
      callFunction(this.config.onBoardChanged);
      return;
    }

    if (this.canMoveDown()) {
      this.currentPosition[1] += 1;
      callFunction(this.config.onBoardChanged);
    } else {

      if (this.currentPosition[1] === 0) {
        this.gameOver = true;
        callFunction(this.config.onGameOver);
        return;
      }

      this.board.merge(this.currentPiece.getShape(), this.currentPosition, this.currentPiece.color);
      this.board.scanFullLines(this.config.onFullLine);
      this.newPiece();
      callFunction(this.config.onBoardChanged);
    }

  }
}
