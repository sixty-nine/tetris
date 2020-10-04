import { Board } from '~/lib/board';
import { Position, Piece } from '~/lib/types';

export default class Graphics {

  private readonly context: CanvasRenderingContext2D;
  private readonly offsetX;
  private readonly offsetY = 25;
  private readonly size = 15;

  constructor(context: CanvasRenderingContext2D) {
    const boardSize = this.size * 15;
    this.offsetX = Math.floor((context.canvas.width - boardSize) / 2);
    this.context = context;
  }

  public drawBoard(board: Board) {

    this.context.fillStyle = 'yellow';

    for (let i = 0; i < board.width; i++) {
      this.context.fillText(
        i.toString(),
        this.offsetX + (i * this.size),
        this.offsetY - 5
      );
    }
    for (let j = 0; j < board.height; j++) {
      this.context.fillText(
        j.toString(),
        this.offsetX - 15,
        this.offsetY + j * this.size + this.size
      );
      this.context.fillText(
        j.toString(),
        this.offsetX + board.width * this.size + 3,
        this.offsetY + j * this.size + this.size
      );
    }




    for (let i = 0; i < board.width; i++) {
      for (let j = 0; j < board.height; j++) {
        this.context.fillStyle = board.getContent([i, j]) ? 'blue' : 'white';
        this.context.fillRect(
          this.offsetX + (i * this.size),
          this.offsetY + j * this.size,
          this.size - 1,
          this.size - 1
        );
      }
    }
  }

  public drawPiece(piece: Piece, position: Position) {
    const shape = piece.getShape();
    const [x, y] = position;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.context.fillStyle = shape[j][i] ? 'red' : 'rgba(255, 255, 0, 0.2)';
        this.context.fillRect(
          this.offsetX + (x + i) * this.size,
          this.offsetY + (y + j) * this.size,
          this.size - 1,
          this.size - 1
        );
      }
    }
  }
};
