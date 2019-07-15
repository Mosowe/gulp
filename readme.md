# gulp

## 生成package.json文件
win+r--‘cmd’ 进入项目目录
```javascript
npm init
```
## gulp 全局安装
```javascript
npm install --global gulp
```
## 安装gulp开发依赖
```javascript
npm install --save-dev gulp
```

## 创建gulpfile.js文件
```javascript
let gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```

## 常用API
1. gulp.src(filePath/pathArr) ：指向指定路径的所有文件,找到目标源文件，将数据读取到gulp的内存中；
2. gulp.dest(dirPath/pathArr) ：指向指定的所有文件夹，将文件输出到指定的文件夹中；
3. gulp.task(name, [deps], fn) ：定义一个任务，`deps`：数组，如果该任务需要等待其他一个（多个）任务完成后执行，则将被等待的任务name写入deps；
4. gulp.watch() ：监视文件的变化；
5. gulp.series() ：用于串行（顺序）执行：存放task的name，按照顺序执行；
6. gulp.parallel() ：用于并行执行：存放task的name，并行执行；

## 常用插件
1. gulp-connect：页面自动更新
2. gulp-postcss: css解析器，将less文件解析成css
3. postcss-px-to-viewport: 移动端单位转换 px -> vw,vh
4. gulp-px2rem-plugin: 移动端单位转换 px -> rem
5. autoprefixer: 自动补全css前缀
6. gulp-clean-css: 压缩css文件，减小文件大小，并给引用url添加版本号避免缓存
7. gulp-less: less预编译
8. gulp-imagemin: 图片压缩
9. gulp-asset-rev: 自动添加版本号
10. gulp-concat: 合并javascript文件，减少网络请求

## 插件的配置

#### gulp-connect：自动更新
###### 安装
`npm install gulp-connect --save-dev`
###### 配置
```javascript
const gulp = require('gulp')
const connect = require('gulp-connect')

gulp.task('connect',function(){
  connect.server({
    port: 3200, // 端口
    livereload: true // 是否自动更新
  })
})
```
#### less文件转css，自动补全css前缀，px转rem：gulp-less，gulp-postcss，autoprefixer，gulp-px2rem-plugin
###### 安装
`npm install gulp-less --save-dev`
`npm install gulp-postcss --save-dev`
`npm install autoprefixer --save-dev`
`npm install gulp-px2rem-plugin --save-dev`
###### 配置
```javascript
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const px2rem = require('gulp-px2rem-plugin')
const autoprefixer = require('autoprefixer')
const less = require('gulp-less')

gulp.task('less', function () {
  var processors = [
    px2rem({
        width_design: 750, // 设计稿宽度。默认值640
        valid_num: 2, // 生成rem后的小数位数。默认值4
        pieces: 10, // 将整屏切份。默认为10，相当于10rem = width_design(设计稿宽度)
        ignore_px: [1,2], // 让部分px不在转换成rem。默认为空数组
        ignore_selector: [] // 让部分选择器不在转换为rem。默认为空数组
    }),
    autoprefixer({ // 自动补全
      browsers: [
        "iOS >= 8",
        "Firefox >= 20",
        "Android > 4.4"
      ]
    })
  ]
  return gulp.src('src/sass/*.scss')
  .pipe(less())
  .pipe(postcss(processors))
  .pipe(gulp.dest('dist/css'))
})
```
#### gulp-clean-css：css压缩
###### 安装
`npm install gulp-clean-css --save-dev`
###### 配置
```javascript
const gulp = require('gulp')
const cssmin = require('gulp-clean-css');

gulp.task('testCssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});
```
#### gulp-imagemin：图片压缩
###### 安装
`npm install gulp-imagemin --save-dev`
###### 配置
```javascript
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
 
gulp.task('imagemin', function() {
  gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});
```


