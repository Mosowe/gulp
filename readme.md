# gulp

## gulp 全局安装
```javascript
npm install --global gulp
```
## 安装gulp开发依赖
```javascript
npm install --save-dev gulp
```

## 创建`gulpfile.js`文件
```javascript
let gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```

## 生成`package.json`文件
```javascript
npm init
```
## 常用API
1. gulp.src(filePath/pathArr) ：指向指定路径的所有文件,找到目标源文件，将数据读取到gulp的内存中；
2. gulp.dest(dirPath/pathArr) ：指向指定的所有文件夹，将文件输出到指定的文件夹中；
3. gulp.task(name, [deps], fn) ：定义一个任务，`deps`：数组，如果该任务需要等待其他一个（多个）任务完成后执行，则将被等待的任务name写入deps；
4. gulp.watch() ：监视文件的变化；
5. gulp.series() ：用于串行（顺序）执行：存放task的name，按照顺序执行；
6. gulp.parallel() ：用于并行执行：存放task的name，并行执行；

