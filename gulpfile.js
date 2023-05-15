import gulp from 'gulp'
import concat from 'gulp-concat'
import imports from 'gulp-imports'

const paths = {
  all: 'app/**/**.js',
  app: 'app/**.js',
  sources: 'app/sources/**.js',
  dest: 'public'
}
export const merge = (done) => {
  return  gulp.src('./app/index.js')
  .pipe(imports())
  .on('error', console.log)
  .pipe(concat('online.js'))
  .pipe(minify())
  .pipe(gulp.dest(paths.dest))
}

export const watch = () => {
  gulp.watch(paths.all, gulp.series(merge))
}