/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', {
        title: '2048',
        development: ('production' != process.env.NODE_ENV)
    });
};

/*
 * GET joystick page.
 */

exports.joystick = function(req, res){
    res.render('joystick', {
        title: '2048',
        development: ('production' != process.env.NODE_ENV)
    });
};
