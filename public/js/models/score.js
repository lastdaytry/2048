define([
    'backbone',
], function(
    Backbone
){
   var Player = Backbone.Model.extend({
        default:
        {
            name: '',
            score: 0
        }
    });
    return Player;
});
