const gulp = require('gulp');
const connect = require('gulp-connect');
const px2rem = require('gulp-px2rem-plugin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');


gulp.task('connect',function(){
  connect.server({
    port: 3200, // 端口
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
  .pipe(postcss(processors))
  .pipe(gulp.dest('dist/css'))
})
// 压缩css文件
gulp.task('cssmin', function () {
  return gulp.src('dist/css/*.css')
      .pipe(cssmin())
      .pipe(gulp.dest('dist/css'));
});

// 压缩图片
gulp.task('imagemin', function() {
  return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

// 重新载入html
gulp.task('html', function () {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
})
// 重新载入js
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(gulp.dest('dist/js'))
})
// 重新载入css:css文件夹下的css文件
gulp.task('css', function () {
  return gulp.src('src/css/*.css')
  .pipe(gulp.dest('dist/css'))
})

gulp.task('watch', function () {
  gulp.watch('src/*.html', gulp.series('html'))
  gulp.watch('src/less/*.less', gulp.series('less', 'cssmin'))
  gulp.watch('src/images/*', gulp.series('imagemin'))
})

gulp.task('default', gulp.parallel('watch', 'connect'))

gulp.task('build', gulp.series('less', 'cssmin', 'imagemin', 'html','js','css'))
