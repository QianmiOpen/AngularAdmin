// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var es6transpiler = require('gulp-es6-transpiler');

var scripts = [
    './src/filter/index.js',
    './src/filter/**/*.js',

    './src/service/index.js',
    './src/service/**/*.js',

    './src/component/index.js',
    './src/component/**/*.js',

    './src/template/index.js',
    './src/template/**/*.js',

    './src/admin.js'
];

// 检查脚本
gulp.task('lint', function () {
    gulp.src(scripts)
        .pipe(jshint({
            expr: true,
            sub: true,
            esnext: true
        }))
        .pipe(jshint.reporter('default'));
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
    gulp.run('lint', 'scripts');

    // 监听文件变化
    gulp.watch(scripts, function () {
        gulp.run('lint', 'scripts', function (o) {
        });
    });
});