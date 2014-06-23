define([
    'backbone',
    'models/tile'
], function(
    Backbone,
    Tile
){
    var Grid = Backbone.Collection.extend({
        size: 4,
        startTiles: 2,
        model: Tile,
        score: 0,

        initialize: function(modeldata, options) {
            var num = this.size * this.size;
            //console.info(options);
            for (var i = 0; i < num; i++) {
                this.add({
                    idx: i,
                    grid: this
                });
            }
        },

        setup: function() {
            for (var j = 0; j < this.startTiles; j++) {
                this.randomTile();
            }
            // notify view to repaint
            this.trigger('tileschange', this);
        },

        getFreeTiles: function() {
            return this.filter(function(tile) {
                return tile.isfree();
            });
        },

        getOccupiedTiles: function() {
            return this.filter(function(tile) {
                return !tile.isfree();
            });
        },
        getTile: function(x,y) {
            return this.filter(function(tile) {
                return tile.check(x,y);
            });
        },

        // randomly choose one free tile, put value on it
        randomTile: function() {
            var tiles = this.getFreeTiles();
            if (tiles.length != 0) {
                var value = Math.random() < 0.9 ? 2 : 4;
                var free = tiles[Math.floor(Math.random() * tiles.length)];
                free.put(value);
                free.set({isNew: true});
            }
        },

        moveTile: function(tile, direction) {
            var moved = false;
            var next = tile.findNext(direction);
            var farthest = next.farthest;
            var sibling = next.sibling;

            // mergedFrom used to prevent continuous merge in one row or col
            if (sibling && sibling.equals(tile) && !sibling.isMerged()) {
                moved = true;
                tile.mergeTo(sibling);
                this.score += sibling.get('value');
            }
            else if (!tile.equals(farthest) ) { // farthest is another free tile
                moved = true;
                farthest.put(tile.get('value'));
                tile.free();
            }
            //console.info(this.getOccupiedTiles());
            //this.trigger('tileschange', this);
            return moved;
        },

        resetTiles: function() {
            this.each(function(tile, i, list) {
                tile.set({mergedFrom: false, isNew: false});
            });
        },

        buildTraversal: function(direction) {
            var otiles = this.getOccupiedTiles();
            return (direction == 'up' || direction == 'left') ?
                otiles : otiles.reverse();
        },

        move: function(direction) {
            var moved = false;
            _(this.buildTraversal(direction)).each(function(tile, i) {
                var r = this.moveTile(tile, direction);
                // moved should be true if one tile moved
                if (!moved) moved = r
            }, this);
            if (moved) { // move done, random a new one and trigger view to repaint
                this.randomTile();
               // console.info(_(this.getOccupiedTiles()).pluck('attributes') );
                this.trigger('tileschange', this);
                this.resetTiles();
            }
        },

        getVector: function(direction) {
          // Vectors representing tile movement
            var map = {
                0: { x: 0, y: -1 }, // Up
                1: { x: 1, y: 0 }, // Right
                2: { x: 0, y: 1 }, // Down
                3: { x: -1, y: 0 } // Left
            };
            return map[direction];
        },

        tileMatchesAvailable: function() {
            var self = this;
            var tile;
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    tile = this.getTile(x,y);
                    if (tile.length >= 1) {
                        for (var direction = 0; direction < 4; direction++) {
                            var vector = self.getVector(direction);
                            var other =  this.getTile(x + vector.x,  y + vector.y);
                            if (other.length && other[0].get('value') === tile[0].get('value')) {
                                return true; // These two tiles can be merged
                            }
                        }
                    }
                }
            }
            return false;
        }


    });
    var grid = new Grid();
    return grid;
});
