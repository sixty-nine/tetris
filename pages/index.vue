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
  let normalSpeed = 1;
  let fastSpeed = 20;
  let gameSpeed = normalSpeed;
  let boardChanged = true;


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
      gameSpeed = normalSpeed;
    },
    onBoardChanged: () => {
      boardChanged = true;
    },
  };
  const game = new Game(gameConfig);


  const sketchConfig = {
    animate: true,
    hotkeys: false,
    dimensions: [512, 512],
    loop: false,
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
      onNextPiece() {
        gameSpeed = fastSpeed;
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
      sketch({ context }: any) {

        const graph = new Graphics(context);
        graph.clear();

        let delta = 0;

        return (context: any) => {

          delta += context.deltaTime;
          if (delta > (1 / gameSpeed)) {
            delta = 0;
            game.run();
          }

          if (boardChanged) {
            boardChanged = false;
            graph.drawBoard(game.board);
            if (game.currentPiece) {
              graph.drawPiece(game.currentPiece, game.currentPosition);
            }
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
