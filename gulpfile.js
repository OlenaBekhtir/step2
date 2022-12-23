const {series, parallel, src, dest, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const imagemin = require("gulp-imagemin");
// const minify = require('gulp-minify');
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');

// Очищення папки dist
function cleanBuild() {  
  return src('./dist/', { read: false, allowEmpty: true })
    .pipe(clean())
}

// Видалення папки scss із папки dist
function cleanSCSS() {
  return src('./dist/scss', {read: false, allowEmpty: true})
      .pipe(clean())
}


// Оптимізація (мінімізація) зображень та копіювання їх у папку dist
function imageMin(cb) {
  src("./src/img/**/*.*")
      .pipe(imagemin())
      .pipe(dest("./dist/img"));
  cb();
}

// Компіляція файлів scss в css, видалення невикористовуваного css коду, конкатенація та мініфікація css, додавання вендорних префіксів для підтримки останніх 10 версій різних браузерів, копіювання мініфікованого файлу styles.min.css у папку dist
function compileCSS() {
  return src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(concat("styles.min.css"))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(dest('./dist/css'))
} 

// Конкатенація та мініфікація js, копіювання мініфікованого файлу script.min.js у папку dist
function js() {
  return src('./src/js/*.js')
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(dest('./dist/js'))
}

// Копіювання файлів з src у dist
function copy(cb) {
  return src('./src/**/*.*')
    .pipe(dest('./dist'))
}

// Запуск сервера та відстеження змін
function serve(cb) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  watch("./src/scss/**/*.scss", compileCSS).on('change', browserSync.reload);
  watch("./src/img/**/*.*", imageMin);
  watch("./src/js/**/*.js", js);
  watch("index.html").on('change', browserSync.reload);
}

exports.cleanBuild = cleanBuild;
exports.cleanSCSS = cleanSCSS;
exports.copy = copy;
exports.compileCSS = compileCSS;
exports.imageMin = imageMin;
exports.js = js;

exports.watch = function () {
  watch('./src/scss/**/*.scss', [compileCSS]);
  watch('./src/js/**/*.js', [js]);
  watch('./src/img/**/*.*', [imageMin]);
};

// Pобоче завдання build
exports.build = series(cleanBuild, compileCSS, js, imageMin, copy);

// Робоче завдання dev
exports.dev = parallel(compileCSS, js, cleanSCSS, serve);

