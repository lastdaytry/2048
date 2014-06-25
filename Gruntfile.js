module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            fest: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    atBegin: true
                }
            },
            express: {
                files:  [
                    'routes/**/*.js',
                    'app.js'
                ],
                tasks:  [ 'express' ],
                options: {
                    spawn: false
                }
            },
            server: {
                files: [
                    'public/js/**/*.js', /* следим за статикой */
                    'public/css/**/*.css'
                ],
                options: {
                    interrupt: true,
                    livereload: true /* перезагрузить страницу */
                }
            },
            sass: {
                files: ['public/css/*.scss'],
                tasks: ['sass'],
                options: {
                    atBegin: true
                }
            }
        },
        express: {
            server: {
                options: {
                    livereload: true,
                    port: 8000,
                    script: 'app.js'
                }
            }
        },
        fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public/js/tmpl'
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'define(function () { return <%= contents %> ; });',
                            {data: data}
                        );
                    }
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'public/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'public/css/',
                ext: '.min.css'
            }
        },
        sass: {
            css: {
                files: [{
                    expand: true,
                    cwd: 'public/css/', /* исходная директория */
                    src: 'main.scss', /* имена шаблонов */
                    dest: 'public/css', /* результирующая директория */
                    ext: '.css'
                }, {
                    expand: true,
                    cwd: 'public/css/',
                    src: 'joystick.scss',
                    dest: 'public/css',
                    ext: '.css'
                }]
            },
        },
        requirejs: {
            build: {
                options: {
                    almond: true,
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main.js",
                    name: "main",
                    optimize: "none",
                    out: "public/js/build/main.js"
                }
            }
        },
        uglify: {
            build: {
                files: [{
                    src: ['public/js/build/main.js'],
                    dest: 'public/js/build.min.js'
                }]
            }
        },
        concat: {
            build: { /* Подзадача */
                options: {
                    separator: ';\n'
                },
                src: ['public/js/lib/almond.js', 'public/js/build/main.js'],
                dest: 'public/js/build/main.js'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['express', 'watch']);
    grunt.registerTask(
        'build', [
            'cssmin', 'fest', 'requirejs:build',
            'concat:build', 'uglify:build'
        ]
    );

};
