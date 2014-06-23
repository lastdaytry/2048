define([
    'backbone',
    'tmpl/gameOver',
    'vm',
    'models/score',
    'collections/scores',
    'localStorageFunc'
], function(
    Backbone,
    tmpl,
    ViewManager,
    Score,
    Scoreboard,
    Storage
) {

    var View = Backbone.View.extend({
        el: ".game__gameover",
        template: tmpl,

        initialize: function() {
            _.bindAll(this, "render", "show", "hide");
        },

        render: function(score) {
            this.$el.html(this.template({
                score: score
            }));
            var gameOverForm = this;
            $('.btn_close').click(function() {
                gameOverForm.hide();
            });
            $('#gameOverForm').on("submit", postScores);
        },

        show: function(score) {
            $('.overlay').show();
            this.render(score);
            this.$el.show();
        },

        hide: function() {
            $('.overlay').hide();
            this.$el.hide();
        }

    });

    function postScores(event) {
        event.preventDefault();
        var data = $(this).serialize();
        var name = $("#nameField").val();
        var score = $("#scoreField").val();
        var player = new Score({
            name: name,
            score: score
        });
        Scoreboard.add(player);
        player = {
            'name': name,
            'score': score
        };
        $('.btn').prop("disabled", true);
        $.ajax({
            url: '/scores',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(response) {
                $('.btn').prop("disabled", false);
                window.location = "/#scoreboard";
                $('.overlay').hide();
                $('#gameOver').hide();
            },

            error: function(response) {
                if (response.status === 400) {
                    $("#formError").html("Type your name");
                } else {
                    var scores = Storage.getJSON('scores');
                    scores.push(player);
                    Storage.setJSON('scores', scores);
                    window.location = "/#scoreboard";
                    $('.overlay').hide();
                    $('#gameOver').hide();
                }
                $('.btn').prop("disabled", false);
            }
        });

    }

    return View;
});
