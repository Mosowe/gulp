const gulp = require('gulp');
const connect = require('gulp-connect');
const px2viewport = require('postcss-px-to-viewport')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const assetRev = require('gulp-asset-rev');

var fs = require('fs');

var env = 'test'; // 用于执行gulp任务时的判断
function set_env(type){
    env = type || 'dev';
    // 生成env.js文件，用于开发页面时，判断环境
    
    fs.writeFile("./src/js/env.js", 'function ENV (){ return "' + env + '"};', function(err){
        err && console.log(err);
    });
}


gulp.task('connect',function(){
  connect.server({
    host: '192.168.74.115',
    port: 3200, // 端口
    root: 'dist', // 入口目录名
    livereload: true // 是否自动更新
  })
})
// 变异less文件：PC端去掉px2rem配置
gulp.task('less', function () {
  set_env(process.env.NODE_ENV)
  var processors = [
    px2viewport({
      viewportWidth: 750, // 设计稿宽度
      viewportUnit: 'vw', // 转换后单位
      minPixelValue: 2 // 设置要替换的最小像素值
    }),
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
  .pipe(assetRev())
  .pipe(postcss(processors))
  // .pipe(cssmin())
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

/* 
 *压缩转移图片 
 */
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
  return gulp.src('src/js/**/*.js')
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

gulp.task('build', gulp.series('less', 'cssmove', 'imagemin', 'html','js'))
gulp.task('default', gulp.parallel('watch', 'connect', 'build'))

