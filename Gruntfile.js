module.exports = function (grunt) {

    // 任务配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                tasks: ['concat'],
                files: ['./src/**/*.js']
            }
        },

        jshint: {
            all: ['./src/**/*.js']
        },

        //uglify: {
        //    options: {
        //        mangle: false,
        //        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
        //        '(function(){\n',
        //        footer: '\n})()'
        //    },
        //    build: {
        //        files: {
        //            './demo/all.min.js': [
        //
        //                './src/filter/index.js',
        //                './src/filter/**/*.js',
        //
        //                './src/service/index.js',
        //                './src/service/**/*.js',
        //
        //                './src/component/index.js',
        //                './src/component/**/*.js',
        //
        //                './src/template/index.js',
        //                './src/template/**/*.js',
        //
        //                './src/admin.js'
        //            ]
        //        }
        //    }
        //},

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                root: './'
            },
            target: {
                files: {
                    './demo/assets/css/lib.min.css': [
                        './demo/assets/plugins/font-awesome/css/font-awesome.min.css',
                        './demo/assets/plugins/simple-line-icons/simple-line-icons.min.css',
                        './demo/assets/plugins/bootstrap/css/bootstrap.min.css',
                        './demo/assets/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        './demo/assets/plugins/uniform/css/uniform.default.css',
                        './demo/assets/css/components.css',
                        './demo/assets/css/plugins.css',
                        './demo/assets/css/layout.css',
                        './demo/assets/css/themes/blue.css',
                        './demo/assets/js/bootstrap-toastr/toastr.min.css',
                        './demo/assets/js/bootstrap-select/bootstrap-select.min.css',
                        './demo/assets/js/data-tables/DT_bootstrap.css',
                        './demo/assets/js/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        './demo/assets/js/bootstrap-daterangepicker/css/daterangepicker-bs3.css',
                        './demo/assets/js/select2/select2.css',
                        './demo/assets/js/select2/select2-metronic.css',
                        './demo/assets/css/custom.css'
                    ]
                }
            }
        },

        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                '(function(){\n',
                footer: '\n})();'
            },
            build: {
                files: {
                    './demo/assets/js/all.js': [

                        './src/filter/index.js',
                        './src/filter/**/*.js',

                        './src/service/index.js',
                        './src/service/**/*.js',

                        './src/component/index.js',
                        './src/component/**/*.js',

                        './src/template/index.js',
                        './src/template/**/*.js',

                        './src/admin.js'
                    ],
                    './demo/assets/js/lib.min.js': [
                        './demo/assets/js/handlebars.js',
                        './demo/assets/js/jquery-1.10.2.min.js',
                        './demo/assets/js/bootstrap/js/bootstrap.min.js',
                        './demo/assets/js/bootstrap-select/bootstrap-select.min.js',
                        './demo/assets/js/bootstrap-datetimepicker/js/moment.js',
                        './demo/assets/js/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        './demo/assets/js/bootstrap-daterangepicker/js/daterangepicker.js',
                        './demo/assets/js/select2/select2.min.js',
                        './demo/assets/js/jquery.blockui.min.js',
                        './demo/assets/js/metronic.js',
                        './demo/assets/js/jquery.dataTables.min.js',
                        './demo/assets/js/bootstrap-toastr/toastr.min.js',
                        './demo/assets/js/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
                        './demo/assets/js/bootstrap-modal/js/bootstrap-modal.js',
                        './demo/assets/js/bootstrap-modal/js/bootstrap-modalmanager.js',
                        './demo/assets/js/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js',
                    ]
                }
            }
        }
    });

    // 任务加载
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
