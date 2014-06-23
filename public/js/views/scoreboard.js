define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores',
    'models/score',
    'vm',
    'views/scoreTable'
], function(
    Backbone,
    tmplScore,
    Scoreboard,
    Player,
    vm,
    ScoreTable
) {
    var ScoreboardView = Backbone.View.extend({
        el: ".page__score",
        template: tmplScore,
        _name: "score",

        initialize: function() {
            this.render();
            this.scoreTable = new ScoreTable(); //Только после рендера основной вьюшки можем создать scoreTable
            this.hide();
        },
        render: function() {
            this.$el.html(this.template);
        },
        show: function() {
            this.$el.show();
            this.scoreTable.show();
            $.event.trigger({
                type: "show",
                _name: this._name
            });

        },
        hide: function() {
            this.$el.hide();
        }
    });
    var view = new ScoreboardView();
    return view;

});
