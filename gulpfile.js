// 引入 gulp
var gulp = require('gulp');

// 引入组件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var es6transpiler = require('gulp-es6-transpiler');
var livereload = require('gulp-livereload');

var scripts = [
        './src/core/event.js',
        './src/core/component.event.js',

        './src/filter/index.js',
        './src/filter/**/*.js',

        './src/service/index.js',
        './src/service/**/*.js',

        './src/components/index.js',
        './src/components/**/*.js',

        './src/template/index.js',
        './src/template/**/*.js',

        './src/admin.js'
    ],
    libScripts = [
        //'./output/assets/js/handlebars.js',
        './output/assets/js/underscore.min.js',
        './output/assets/js/jquery-1.10.2.min.js',
        './output/assets/js/jquery-validation/dist/jquery.validate.min.js',
        './output/assets/js/jquery.validate.extends.js',
        './output/assets/js/bootstrap/js/bootstrap.min.js',
        './output/assets/js/bootbox/bootbox.min.js',
        './output/assets/js/angular.1.3.8.min.js',
        './output/assets/js/angular-ui-router.min.js',
        './output/assets/js/bootstrap-select/bootstrap-select.min.js',
        './output/assets/js/bootstrap-datetimepicker/js/moment.js',
        './output/assets/js/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
        './output/assets/js/bootstrap-daterangepicker/js/daterangepicker.js',
        './output/assets/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
        './output/assets/plugins/uniform/jquery.uniform.min.js',
        './output/assets/plugins/fuelux/js/spinner.min.js',
        './output/assets/js/select2/select2.min.js',
        './output/assets/js/jquery.blockui.min.js',
        './output/assets/js/metronic.js',
        //'./output/assets/js/jquery.dataTables.min.js',
        './output/assets/js/bootstrap-toastr/toastr.min.js',
        './output/assets/js/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
        './output/assets/js/bootstrap-modal/js/bootstrap-modal.js',
        './output/assets/js/bootstrap-modal/js/bootstrap-modalmanager.js',
        './output/assets/js/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js',
        './output/assets/js/bootstrap-maxlength.min.js'
        //'./output/assets/js/highcharts/js/highcharts.js',
        //'./output/assets/js/zTree_v3/js/jquery.ztree.all-3.5.min.js'
    ];

// 检查脚本
gulp.task('libScripts', function () {
    gulp.src(libScripts)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./output/js'));
});

// 合并，压缩文件
gulp.task('scripts', function () {
    gulp.src(scripts)
        .pipe(es6transpiler({
            disallowUnknownReferences: false
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./output/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./output/js'));
});

// 默认任务
gulp.task('default', function () {
    gulp.run('scripts', 'libScripts');

    livereload.listen();

    // 监听文件变化
    gulp.watch(scripts, function (file) {
        gulp.run('lint', 'scripts', function (o) {
            setTimeout(function () {
                livereload.reload();
            }, 1 * 1000);
        });
    });
});