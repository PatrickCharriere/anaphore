const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function () {
	const tsResult = tsProject.src()
		.pipe(tsProject());
	return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('assets', function () {
	return gulp.src(JSON_FILES)
		.pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('scripts', 'assets'));

gulp.task('watch', gulp.series('scripts', 'assets', function () {
	gulp.watch('./src/**/*.ts', gulp.series('build'));
}));

gulp.task('default', gulp.series('watch'));