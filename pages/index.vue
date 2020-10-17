<template>
  <div class="canvas__container">
    <canvas ref="canvas"/>
    <div>
      <button @click="onLeft">L</button>
      <button @click="onRotateLeft">L-Rot</button>
      <button @click="onNext(1)">Next Step</button>
      <button @click="onNextPiece">Next Piece</button>
      <button @click="onRotateRight">R-Rot</button>
      <button @click="onRight">R</button>
      <button @click="onDebug">Debug</button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Game, GameConfig } from '~/lib/game';
  import Graphics from '~/lib/graphics';
  import { Piece } from "~/lib/types";

  let score = 0;
  const gameConfig: GameConfig = {
    onFullLine: (line: number) => {
      score += 100;
      console.log('Full line', line);
    },
    onGameOver: () => {
      alert('game over: '+ score);
    },
    onNewPiece: (cur: Piece, next: Piece) => {
      console.log('new piece', cur.name, next.name);
    },
  };
  const game = new Game(gameConfig);

  const sketchConfig = {
    animate: true,
    hotkeys: false,  // <-- the only default value passed
    // Set loop duration to 3 seconds
    duration: 3,
    // Use a small size for our GIF output
    dimensions: [512, 512],
    // Optionally specify an export frame rate, defaults to 30
    fps: 10,
  };


  let runningGame : number;
  const gameSpeed = 2;
  const clearGame = () => {
    if (runningGame) {
      clearTimeout(runningGame);
      runningGame =0;
    }
  };
  const runGame = () => {
    clearGame();
    game.run();
    runningGame = setTimeout(runGame, 1000 / gameSpeed);
  };
  const runToNextPiece = (p: any = null) => {
    if (game.isGameOver()) {
      return;
    }

    clearGame();
    if (p === null) {
      p = game.currentPiece;
    }
    if (game.currentPiece === p) {
      game.run();
      runningGame = setTimeout(() => {
        runToNextPiece(p);
      }, 100);
    } else {
      runGame();
    }
    const curPiece = game.currentPiece;

    while (curPiece === game.currentPiece) {
      runGame();
    }
    clearTimeout(runningGame);
    runningGame = runGame();
  };
  const gameOver = () => {
    if (runningGame) {
      alert('game over');
    }
    clearGame();
  };

  export default Vue.extend({
    data: () => ({
      sketchManager: null,
    }),
    created() {
      window.addEventListener('keypress', this.onKeyPress);
    },
    destroyed() {
      window.removeEventListener('keypress', this.onKeyPress);
    },
    async mounted() {

      try {

        sketchConfig.canvas = this.$refs.canvas;
        this.sketchManager = await this.$sketch(sketchConfig, this.sketch);

      } catch (e) {

        console.error(e);

      }

    },
    beforeDestroy() {

      this.sketchManager?.unload();

    },
    methods: {
      onNext(count: number) {
        for (let i = 0; i < count; i++) {
          runGame();
        }
      },
      onNextPiece() {
        runToNextPiece();
      },
      onRotateLeft() {
        game.rotateLeft();
      },
      onRotateRight() {
        game.rotateRight();
      },
      onLeft() {
        game.moveLeft();
      },
      onRight() {
        game.moveRight();
      },
      onKeyPress(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
          case 'a': return this.onLeft();
          case 'd': return this.onRight();
          case 'w': return this.onRotateLeft();
          case 's': return this.onRotateRight();
          case ' ': return this.onNextPiece();
        }
      },
      onDebug() {
        console.log('CUR PIECE', game.currentPiece ? game.currentPiece.getShape() : null);
        console.log('CUR POS', game.currentPosition);
        console.log('CUR ROT', game.currentPiece ? game.currentPiece.curRotation : null);
      },
      sketch({context, width, height }: any) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        const graph = new Graphics(context);

        runGame();

        return (context) => {
          if (!this.bla) {
            this.bla = true;
            console.log(context);
          }
          console.log(context.time);
          graph.drawBoard(game.board);

          if (game.currentPiece) {
            graph.drawPiece(game.currentPiece, game.currentPosition);
          }
        };
      },
    },
  });
</script>

<style scoped>
  canvas {

    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

  }
</style>
