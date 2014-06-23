define([
    'backbone',
    'tmpl/game',
    'tmpl/gameBoard',
    'tmpl/gameTile',
    'vm',
    'views/gameOver',
    'collections/grid'
], function(
    Backbone,
    tmpl,
    tmplBoard,
    tmplTile,
    vm,
    gameOver,
    grid
){

    var View = Backbone.View.extend({

        template: tmpl,
        tmplBoard: tmplBoard,
        tmplTile: tmplTile,

        el: ".page__game",
        _name: "game",

        events: {
            'keydown': 'move'
        },
        keyMap: {
            38: 'up',
            39: 'right',
            40: 'down',
            37: 'left'
        },


        initialize: function () {
            this.listenTo(app.grid, 'tileschange', this.rePaint());
            this.render();
            app.grid.setup();
            this.$el.hide();

            //this.gameOverForm = new gameOver();
            //this.gameOver = false;

        },
        render: function () {
            //this.template = this.$template('.grid-container').html(this.tmplBoard({size: this.model.size}));
            this.$el.html(this.template);
            this.$('.grid-container')
                .html(this.tmplBoard({size: this.model.size}));

        },
        show: function () {
            $.event.trigger({
                type: "show",
                name: this._name
            });
            this.$el.show();
            //this.gameOver = true;
            //this.gameOverForm.show(2);

        },
        move: function(event) {
            var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                event.shiftKey;
            var dir    = this.keyMap[event.which];
            if (!modifiers && dir != undefined) {
                event.preventDefault();
                app.grid.move(dir);
            }
        },
        _normalizePos: function(x, y) {
            return {
                x: x + 1,
                y: y + 1
            };
        },
        clearTiles: function() {
            $('.tile-container').empty();
        },
        rePaint: function(grid) {
            this.clearTiles();
            //console.log(app.grid.data);
            var tiles = grid.getOccupiedTiles();
            _(tiles).each(function(tile, i) {
                var pos = this._normalizePos(tile.get('x'), tile.get('y'));
                var tplstr = this.tileTpl({x:pos.x, y:pos.y, value:tile.get('value')});
                var tileEl = $(tplstr);
                if (tile.isNew())
                    tileEl.addClass('tile-new');
                else if (tile.isMerged())
                    tileEl.addClass('tile-merged');
                $('.tile-container').append(tileEl);
            }, this);
        },
        log: function(grid) {
            var padding = '      ';
            var row = [];
            grid.each(function(tile, i, list) {
                if (tile.isfree())
                    row.push(padding);
                else
                    row.push( (padding + tile.get('value')).slice(-6) );
                if (i % grid.size == grid.size-1) {
                    console.info(row.join(' | '));
                    row = [];
                }
            });
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return View({model: grid});
});
