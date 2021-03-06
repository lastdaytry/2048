define([
    'backbone',
], function(
    Backbone
){
    var Tile = Backbone.Model.extend({
        defaults: {
                    x: null, y: null,
                    idx: null,
                    value: 0
                },

        initialize: function() {
            var pos = this.getPos();
            this.set({x:pos.x, y:pos.y});
        },

        getPos: function() {
            //var x = this.get('x'), y = this.get('y');
            //if (x != null && y != null)
                //return {x:x, y:y};
            var idx = this.get('idx');
            var size = this.get('grid').size;
            var y = Math.floor(idx / size);
            var x = idx % size;
            return {x:x, y:y};
        },
        check: function(x,y) {
           return this.get('x') == x && this.get('y') == y;
        },

        put: function(value) {
            this.set({value: value});
            //var pos = this.getPos();
            //this.set({x:pos.x, y:pos.y, value:value});
        },

        isfree: function() {
            //return this.get('x') == null && this.get('y') == null;
            return this.get('value') == 0;
        },

        free: function() {
            //this.set({x:null, y:null});
            this.set({value: 0, mergedFrom: false});
        },

        up: function() {
            var idx = this.get('idx');
            var size = this.get('grid').size;
            var up = idx - size;
            return up < 0 ? null : this.get('grid').at(up);
        },
        down: function() {
            var idx = this.get('idx');
            var size = this.get('grid').size;
            var down = idx + size;
            return down >= size*size ? null : this.get('grid').at(down);
        },
        left: function() {
            var idx = this.get('idx');
            var size = this.get('grid').size;
            var left = idx - 1;
            return idx % size == 0 ? null : this.get('grid').at(left);
        },
        right: function() {
            var idx = this.get('idx');
            var size = this.get('grid').size;
            var right = idx + 1;
            return idx % size == size-1 ? null : this.get('grid').at(right);
        },

        // find next available tiles as far as possible following the direction
        // return this tile and its sibling
        findNext: function(direction) {
            var farthest;
            var tile = this;
            do {
                farthest = tile;
                tile = tile[direction]();
            } while (tile && tile.isfree());
            return {farthest:farthest, sibling:tile};
        },

        equals: function(other) {
            return this.get('value') == other.get('value');
        },

        isMerged: function() {
            return this.get('mergedFrom');
        },
        isNew: function() {
            return this.get('isNew');
        },

        mergeTo: function(other) {
            var value = this.get('value');
            other.put(value*2);
            other.set({mergedFrom: true});
            this.free();
        },

        moveTo: function(other) {
            other.put(this.get('value'));
            this.free();
        }

    });
    return Tile;
});
