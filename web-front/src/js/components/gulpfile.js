'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

// tools --------------------------------------------------
var rimraf          = require('rimraf');

//                                                          |
//                         tasks                            |
//                                                          |

// -------------------------------------------------------- | clean
gulp.task('clean', function (cb) {
    rimraf( './dist/*', cb );
});


// -------------------------------------------------------- | default
gulp.task('default', () =>
	gulp.src(['*.jsx', '*.js', '!gulpfile*'])
		.pipe(babel({
			presets: ['env', 'react']
		}))
		.pipe(gulp.dest('dist'))
);
