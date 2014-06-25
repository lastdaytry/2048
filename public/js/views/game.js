define([
    'backbone',
    'tmpl/game',
    'tmpl/gameBoard',
    'tmpl/gameTile',
    'vm',
    'views/gameOver',
    'collections/grid',
    'serverConnection',
    'lib/Connector'
], function(
    Backbone,
    tmpl,
    tmplBoard,
    tmplTile,
    vm,
    gameOver,
    Grid,
    serverHelper,
    Connector
){

    var View = Backbone.View.extend({

        template: tmpl,
        tmplBoard: tmplBoard,
        tmplTile: tmplTile,

        el: $(document),
        _name: "game",

        //events: {
        //    'keydown': 'move'
        //},
        // keyMap: {
        //     38: 'up',
        //     39: 'right',
        //     40: 'down',
        //     37: 'left'
        // },



        initialize: function () {
            this.listenTo(Grid, 'tileschange', this.rePaint);
            //this.listenTo(Grid, 'tileschange', this.log);
            this.render();
            Grid.setup();
            var self = this;
            this.$el.find('.page__game').hide();

            this.gameOverForm = new gameOver();
            this.gameOver = false;

            var self = this;
            server.on('message', function(data, answer) {
                switch (data.type) {
                    case 'up':
                        self.move('up');
                        break;
                    case 'down':
                        self.move('down');
                        break;
                    case 'left':
                        self.move('left');
                        break;
                    case 'right':
                        self.move('right');
                        break;
                    case 'newGame':
                        Grid.clearGrid();
                        Grid.setup();
                }
            });

        },
        render: function () {
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
            this.$el.find('.container').hide();
            serverHelper.init();

        },
        // move: function(event) {
        //     var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
        //         event.shiftKey;
        //     var dir    = this.keyMap[event.which];
        //     if (!this.movesAvailable()) {
        //         this.gameOver = true;
        //         this.gameOverForm.show(Grid.score);
        //     }
        //     if (!modifiers && dir != undefined) {
        //         event.preventDefault();
        //         Grid.move(dir);
        //     }
        // },
        move: function(dir) {
            console.log('move');
            if (!this.movesAvailable() && !this.gameOver) {
                this.gameOver = true;
                this.gameOverForm.show(Grid.score);
            }
            if (dir != undefined) {
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
        movesAvailable: function() {
            return Grid.getFreeTiles().length || Grid.tileMatchesAvailable();
        },
        hide: function () {
            this.$el.find('.page__game').hide();
        },
        messegeResieved: function(data, answer) {
            if (data.type == 'up') {
                this.move('up');
            }
        }

    });

    return new View({model: Grid});
});
