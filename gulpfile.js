var gulp = require('gulp'),
	rename = require("gulp-rename"),
	minifyCSS = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	revAppend = require('gulp-rev-append'),
	less = require('gulp-less'),
	browserSync = require('browser-sync'),
	closureCompiler = require('gulp-closure-compiler');

//connect
gulp.task('browser-sync', function(){
	browserSync({
		proxy: "/web-develop/inCanvas",
	});
});

//less compiler
gulp.task('less', function () {
	return gulp.src('less/style.less')
		.pipe(less())
		.pipe(gulp.dest('css/'))
		.pipe(minifyCSS())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest('app/css/'))
		.pipe(notify('less'));
});

// append JavaScript files
gulp.task('appendJs', function() {
	return gulp.src('lib/*.js')
		.pipe(gulp.dest('app/js/'));
});

//rev controll
gulp.task('revAppend', ['less'],  function() {
	return	gulp.src('*.html')
		.pipe(revAppend())
		.pipe(gulp.dest('app/'))
		.pipe(notify('revAppend!'));
});

//file watcher
gulp.task('watch', function(){
	gulp.watch('less/style.less', ['less']);
	gulp.watch('js/*.js', ['appendJs']);
	gulp.watch('/index.html',['revAppend']).on("change", browserSync.reload);
	gulp.watch("/js/*.js").on("change", browserSync.reload);
	gulp.watch('css/*.css').on("change", browserSync.reload);
});

gulp.task('default', ['browser-sync','revAppend', 'appendJs', 'less', 'watch']);