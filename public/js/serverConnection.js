define([
    'backbone',
    'tmpl/game',
    'lib/Connector'
], function(
    Backbone,
    tmpl,
    Connector
){
    var Console = Backbone.View.extend({
        template: tmpl,

        // Инициализация
        initialize: function() {
            // Создаем связь с сервером
            this.server = new Connector({
                server: ['getToken', 'bind'],
                remote: '/console'
            });

            window.server = this.server;
            var self = this;
            this.server.on('player-joined', function(data){
                self.start(data.guid);
            });

            this.server.on('reconnect', this.reconnect);
        },

        init: function() {
            if (!localStorage.getItem('consoleguid')){
                // Получаем токен

                this.server.getToken(function(token){
                    $('#token').html(token);
                //message.innerHTML = 'token: ' + token;
                });
            } else { // иначе
                // переподключаемся к уже созданной связке
                this.reconnect();
            }
        },

        // Переподключение
        reconnect: function(){
            // Используем сохранненный id связки
            var self = this;
            this.server.bind({guid: localStorage.getItem('consoleguid')}, function(data){
                // Если все ок
                if (data.status == 'success'){
                    // Стартуем
                    self.start(data.guid);
                // Если связки уже нет
                } else if (data.status == 'undefined guid'){
                    // Начинаем все заново
                    localStorage.removeItem('consoleguid');
                    self.init();
                }
            });
        },

        // Старт игры
        start: function(guid){
            localStorage.setItem('consoleguid', guid);
            $(".token").hide();
            $(".container").show();
            //$.event.trigger({type: "up"});
            server.on('message', function(data, answer){
                answer('answer');
            });
        }
    });

    return new Console();
});
