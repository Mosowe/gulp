const gulp = require('gulp');
const connect = require('gulp-connect');
const px2rem = require('gulp-px2rem-plugin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const assetRev = require('gulp-asset-rev');

gulp.task('connect',function(){
  connect.server({
    host: '0.0.0.0',
    port: 3200, // 端口
    root: 'dist', // 入口目录名
    livereload: true // 是否自动更新
  })
})
// 变异less文件：PC端去掉px2rem配置
gulp.task('less', function () {
  var processors = [
    autoprefixer({ // 自动补全
      overrideBrowserslist: [
        "iOS >= 8",
        "Firefox >= 20",
        "Android > 4.4"
      ]
    })
  ]
  return gulp.src('src/less/*.less')
  .pipe(less())
  .pipe(px2rem({
    width_design: 750, // 设计稿宽度。默认值640
    valid_num: 2, // 生成rem后的小数位数。默认值4
    pieces: 10, // 将整屏切份。默认为10，相当于10rem = width_design(设计稿宽度)
    ignore_px: [1,2], // 让部分px不在转换成rem。默认为空数组
    ignore_selector: [] // 让部分选择器不在转换为rem。默认为空数组
  }))
  .pipe(assetRev())
  .pipe(postcss(processors))
  .pipe(cssmin())
  .pipe(gulp.dest('dist/css'))
  .pipe(connect.reload());
})

// 迁移src/css文件
gulp.task('cssmove', function () {
  return gulp.src('src/css/*.css')
      .pipe(cssmin())
      .pipe(gulp.dest('dist/css'))
      .pipe(connect.reload());
});

// 压缩转移图片
gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*')
        .pipe(imagemin({
          optimizationLevel: 1,
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});
// 重新载入html
gulp.task('html', function () {
  return gulp.src('src/*.html')
  .pipe(assetRev())
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
})
// 重新载入js
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('dist/js'))
  .pipe(connect.reload());
})

gulp.task('watch', function () {
  gulp.watch('src/*.html', gulp.series('html'))
  gulp.watch('src/css/*.css', gulp.series('cssmove'))
  gulp.watch('src/js/*.js', gulp.series('js'))
  gulp.watch('src/less/*.less', gulp.series('less'))
  gulp.watch('src/images/**/*', gulp.series('imagemin'))
})

gulp.task('default', gulp.parallel('watch', 'connect'))

gulp.task('build', gulp.series('less', 'cssmove', 'imagemin', 'html','js'))
