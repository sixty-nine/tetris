<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { allTiles } from '~/lib/tiles';
  import Graphics from '~/lib/graphics';
  import { Position, Piece } from '~/lib/types';

  export default Vue.extend({
    data: () => ({
      sketchManager: null,
    }),
    async mounted() {


      try {

        const config = {
          animate: true,
          hotkeys: false,
          dimensions: [1024, 512],
          loop: false,
          canvas: this.$refs.canvas,
        };
        this.sketchManager = await this.$sketch(config, this.sketch);

      } catch (e) {

        console.error(e);

      }

    },
    beforeDestroy() {
      this.sketchManager?.unload();
    },
    methods: {
      sketch({context}: any) {

        const graph = new Graphics(context);
        graph.clear();

        let pos: Position = [0, 0];
        allTiles().forEach((tile) => {
          graph.drawPiece(new Piece(tile.name, tile.tile, 1), pos);
          graph.drawPiece(new Piece(tile.name, tile.tile, 1, 1), [pos[0], pos[1] + 5]);
          graph.drawPiece(new Piece(tile.name, tile.tile, 1, 2), [pos[0], pos[1] + 10]);
          graph.drawPiece(new Piece(tile.name, tile.tile, 1, 3), [pos[0], pos[1] + 15]);
          pos[0] += 5;
          console.log('----', tile);
        });

        return (context: any) => {

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
