define(['backbone',
 'views/main',
 'views/scoreboard',
 'views/game',
 'vm'
], function(Backbone,
    mainScreen,
    scoreboardScreen,
    gameScreen,
    vm
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },

        initialize: function() {
            this.vm = vm; // init viewManager
        },
        defaultActions: function() {
            vm.addView(mainScreen._name, mainScreen);
            mainScreen.show();
        },
        scoreboardAction: function() {
            vm.addView(scoreboardScreen._name, scoreboardScreen);
            scoreboardScreen.show();
        },
        gameAction: function () {
            vm.addView(gameScreen._name, gameScreen);
            gameScreen.show();
        }
    });

    return new Router();
});
