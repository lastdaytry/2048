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
    Grid
){

    var View = Backbone.View.extend({

        template: tmpl,
        tmplBoard: tmplBoard,
        tmplTile: tmplTile,

        el: $(document),
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
            this.listenTo(Grid, 'tileschange', this.rePaint);
            //this.listenTo(Grid, 'tileschange', this.log);
            this.render();
            Grid.setup();
            this.$el.find('.page__game').hide();

            //this.gameOverForm = new gameOver();
            //this.gameOver = false;

        },
        render: function () {
            //this.template = this.$template('.grid-container').html(this.tmplBoard({size: this.model.size}));
            this.$el.find('.page__game').html(this.template);
            this.$('.grid-container')
                .html(this.tmplBoard({size: this.model.size}));

        },
        show: function () {
            $.event.trigger({
                type: "show",
                name: this._name
            });
            this.$el.find('.page__game').show();
            //this.gameOver = true;
            //this.gameOverForm.show(2);

        },
        move: function(event) {
            var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                event.shiftKey;
            var dir    = this.keyMap[event.which];
            if (!modifiers && dir != undefined) {
                event.preventDefault();
                Grid.move(dir);
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
                var tplstr = this.tmplTile({x:pos.x, y:pos.y, value:tile.get('value')});
                var tileEl = $(tplstr);
                if (tile.isNew())
                    tileEl.addClass('tile-new');
                else if (tile.isMerged())
                    this.updateScore();

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
        updateScore: function() {
            this.$el.find('.score-container').html(Grid.score);
        },
        hide: function () {
            this.$el.find('.page__game').hide();
        }

    });

    return new View({model: Grid});
});
