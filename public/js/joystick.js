require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        "socket.io": "/js/lib/socket.io",
        modernizr: "lib/Modernizr"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        },
        'modernizr': {
            exports: 'modernizr'
        }
    }
});

define([
    'Connector',
    'jquery',
    'modernizr'
], function(
    Connector,
    jquery,
    modernizr
){
    /*var message = document.getElementById('message');*/
    var input = document.getElementById('input-token');
    var start, init, reconnect;
    var token_screen = $('#token-screen');
    var joystick = $('#joystick');

    var newGameBtn = $("#newGame_btn")
    var iconc = $('#iconc');
    var cat_block = $('#cat_block');
    var mobile_cat = $('#mobile_cat');
    var errorForm = $('#errorForm');
    var width_of_block;
    var replay = document.getElementById('replay_btn');
    var next = document.getElementById('next_btn');
    var upButton = document.getElementById('upBtn');
    var leftButton = document.getElementById('leftBtn');
    var rightButton = document.getElementById('rightBtn');
    var downButton = document.getElementById('downBtn');
    var newGameButton = document.getElementById('newGameBtn');

    // Создаем связь с сервером
    var server = new Connector({
            server: ['bind'],
            remote: '/player'
        }
    );
    token_screen.hide();
    // Инициализация
    init = function() {
            //      message.innerHTML = 'ready';
        // Если id нет
        if (!localStorage.getItem('playerguid')){
            // Ждем ввода токена
            input.parentNode.addEventListener('submit', function(e){
                e.preventDefault();
                // И отправляем его на сервер
                server.bind({token: input.value}, function(data){
                    if (data.status == 'success'){ //  В случае успеха
                        // Стартуем джостик
                        start(data.guid);
                    }
                });
            }, false);

        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect();
        }
    };

    // Переподключение
    // Используем сохранненный id связки
    reconnect = function(){
        server.bind({guid: localStorage.getItem('playerguid')}, function(data){
            // Если все ок
            if (data.status == 'success'){
                // Стартуем
                start(data.guid);
            // Если связки уже нет
            } else if (data.status == 'undefined guid'){
                // Начинаем все заново
                localStorage.removeItem('playerguid');
                init();
            }
        });
    };


    // Старт игры
    start = function(guid){
        document.getElementById('toolbar').style.display = 'block';
        localStorage.setItem('playerguid', guid);
        token_screen.hide();
        joystick.show();
    };

    server.on('reconnect', reconnect);

    if (verifyBrouser()) {
        token_screen.show();
        init();
    } else {
        errorForm.show();
    }

    window.addEventListener('deviceorientation', handleOrientation);
    upButton.addEventListener('click', handleUpClickBtn);
    leftButton.addEventListener('click', handleLeftClickBtn);
    rightButton.addEventListener('click', handleRightClickBtn);
    downButton.addEventListener('click', handleDownClickBtn);
    newGameButton.addEventListener('click', handleNewGameBtn);
    $( window ).on( "orientationchange", handleOrientationChange);

    function handleOrientationChange(event) {
        var orientation = getOrientation();
        if (orientation == "portrait") {
            server.send(({
                type: "orient",
                value: "p"
                }), function(answer){
                    console.log(answer);
                }
            );
        }

        if (orientation == "landscape") {
            server.send(({
                type: "orient",
                value: "l"
                }), function(answer){
                    console.log(answer);
                }
            );
        }
    }

    function checkOrientation() {
        if (getOrientation() === "portrait") {

        }
        else {
            hideMessage();
       }
    }

    function handleOrientation(event) {
        currentAngle = Math.floor(event.beta);
        if (currentAngle > 75) currentAngle = 75;
        if (currentAngle < -75) currentAngle = -75;
        server.send(({
            type: "angle",
            value: currentAngle
            }), function(answer){
                console.log(answer);
            }
        );
    }

    function handleUpClickBtn() {
        server.send(({
            type: "up",
        }), function(answer){
            console.log(answer);
            }
        );
    }

    function handleLeftClickBtn() {
        server.send(({
            type: "left",
        }), function(answer){
            console.log(answer);
            }
        );
    }

    function handleRightClickBtn() {
        server.send(({
            type: "right",
        }), function(answer){
            console.log(answer);
            }
        );
    }

    function handleDownClickBtn() {
        server.send(({
            type: "down",
        }), function(answer){
            console.log(answer);
            }
        );
    }

    function handleNewGameBtn() {
        server.send(({
            type: "newGame",
        }), function(answer){
            console.log(answer);
            }
        );
    }

    function getOrientation() {
        return window.orientation % 180 === 0 ? "portrait" : "landscape";
    }

    function verifyBrouser() {
        if (Modernizr) {
            // TODO
            if (!Modernizr.websockets || !Modernizr.borderradius
                || !Modernizr.localstorage || Modernizr.touch) {
                $('.error').show();
                $('#token-screen').hide();
                return false;
            }
        }
        return true;
    }

    window.server = server;

    handleOrientationChange();
});
