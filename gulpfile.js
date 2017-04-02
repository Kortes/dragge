var gulp 	= require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    svgSprite = require('gulp-svg-symbols'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    rimraf = require('rimraf'),
    nunjucks = require('gulp-nunjucks-html'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;
  
var path = {
    build: { //куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'images/'
    },
    src: { //откуда брать исходники
    	html: 'src/pages/*.html',
        templates: 'src/blocks',
        js: 'src/js/main.js',
        style: 'src/style/main.less',
        img: 'images/*.*',
        svg: 'images/svg/*.*'
    },
    watch: { //за изменением каких файлов мы хотим наблюдать
    	pages: 'src/pages/*.html',
        templates: 'src/blocks/**/*.njk',
        js: 'src/js/*.js',
        style: 'src/blocks/**/*.less',
        img: 'images/*.*',
        svg: 'images/svg/*.*',
        vendor: 'vendor/**/*.*'
    },
    clean: ['./build']
};

var config = {
    startPath:"./build",
    server: {
        baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html', () => {
    return gulp.src(path.src.html)
        .pipe(nunjucks({
            searchPaths: [path.src.templates]
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer())
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('images', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({ 
            optimizationLevel: 3, 
            progressive: true, 
            interlaced: true }))
        .pipe(gulp.dest(path.build.img))
});

gulp.task('create-sprite', function () {
    gulp.src(path.src.svg)
        // .pipe(imagemin())
        // .pipe(cheerio({
        //     run: function ($) {
        //         $('[fill]').removeAttr('fill');
        //         $('[style]').removeAttr('style');
        //     },
        //     parserOptions: { xmlMode: true }
        // }))
        // .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            id: "icon-%f",
            svgClassname: "icon-sprite",
            templates: ['default-svg']
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('clear-sprite', function(cb) {
    rimraf('images/svg-symbols.svg', cb);
});

gulp.task('sprite', [
    'clear-sprite',
    'create-sprite'
]);

gulp.task('build', [
	'html',
    'sprite',
    'images',
    'js',
    'style'
]);

gulp.task('watch', function(){
    watch([path.watch.pages, path.watch.templates], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.svg], function(event, cb) {
        gulp.start('sprite');
    });
    watch([path.watch.img], ['images']);
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);