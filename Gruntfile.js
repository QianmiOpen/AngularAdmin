module.exports = function (grunt) {

    // 任务配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                tasks: ['concat:build'],
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
        //            './output/all.min.js': [
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
                    './output/css/all.css': [
                        './output/assets/plugins/font-awesome/css/font-awesome.min.css',
                        './output/assets/plugins/simple-line-icons/simple-line-icons.min.css',
                        './output/assets/plugins/bootstrap/css/bootstrap.min.css',
                        './output/assets/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        './output/assets/plugins/uniform/css/uniform.default.css',
                        './output/assets/css/components.css',
                        './output/assets/css/plugins.css',
                        './output/assets/css/layout.css',
                        './output/assets/css/themes/grey.css',
                        './output/assets/js/bootstrap-toastr/toastr.min.css',
                        './output/assets/js/bootstrap-select/bootstrap-select.min.css',
                        './output/assets/js/data-tables/DT_bootstrap.css',
                        './output/assets/js/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        './output/assets/js/bootstrap-daterangepicker/css/daterangepicker-bs3.css',
                        './output/assets/js/select2/select2.css',
                        './output/assets/js/select2/select2-metronic.css',
                        './output/assets/css/custom.css'
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
                    './output/js/all.js': [

                        './src/filter/index.js',
                        './src/filter/**/*.js',

                        './src/service/index.js',
                        './src/service/**/*.js',

                        './src/component/index.js',
                        './src/component/**/*.js',

                        './src/template/index.js',
                        './src/template/**/*.js',

                        './src/admin.js'
                    ]
                }
            },
            build_lib: {
                files: {
                    './output/js/lib.js': [
                        './output/assets/js/handlebars.js',
                        './output/assets/js/jquery-1.10.2.min.js',
                        './output/assets/js/bootstrap/js/bootstrap.min.js',
                        './output/assets/js/angular.1.3.8.min.js',
                        './output/assets/js/angular-ui-router.min.js',
                        './output/assets/js/bootstrap-select/bootstrap-select.min.js',
                        './output/assets/js/bootstrap-datetimepicker/js/moment.js',
                        './output/assets/js/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        './output/assets/js/bootstrap-daterangepicker/js/daterangepicker.js',
                        './output/assets/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                        './output/assets/plugins/uniform/jquery.uniform.min.js',
                        './output/assets/js/select2/select2.min.js',
                        './output/assets/js/jquery.blockui.min.js',
                        './output/assets/js/metronic.js',
                        './output/assets/js/jquery.dataTables.min.js',
                        './output/assets/js/bootstrap-toastr/toastr.min.js',
                        './output/assets/js/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
                        './output/assets/js/bootstrap-modal/js/bootstrap-modal.js',
                        './output/assets/js/bootstrap-modal/js/bootstrap-modalmanager.js',
                        './output/assets/js/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js',
                        './output/assets/js/highcharts/js/highcharts.js'
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
