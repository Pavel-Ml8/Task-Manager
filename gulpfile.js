'use strict';

const gulp = require('gulp');
const {src, dest, watch, series, parallel} = require('gulp');
const pipeline = require('readable-stream').pipeline;
const uglify = require('gulp-uglify');
const uglifyEs = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const del = require('del');
const imagemin = require('gulp-imagemin');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const browserSync = require('browser-sync').create();


//Таск для минификации html_____________________________________________________

//Порядок подключения html файлов для минификации в финальную папку
let htmlFiles = [
    './src/*.html'
];

function htmlMinify(cb) {
    src(htmlFiles)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./build/'))
        // При проблемах закомментировать, но раскомментировать в func watchFiles
        .pipe(browserSync.stream());
    cb();
}

//Таск для компиляции scss стилей в css__________________________________________

//Порядок подключения файлов со стилями scss
let scssFiles = [
    './src/styles/scss/main.scss'
];

function sassConverter(cb) {
    src(scssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError()))
        .pipe(autoprefixer(['last 5 versions']))
        .pipe(sourcemaps.write())
        .pipe(dest('./src/styles/'));
    cb();
}

//Таск для конкатенации и минификации css_________________________________________
//Отдельно менять стили в css файлах которые скомпилированы из scss не следует,
// так как они всё равно перезапишутся после след запуска компиляции

//Имя основного финального файла стилей
let mainCssFile_Name = 'main.css';

//Порядок подключения файлов со стилями css для их конкатенации
let cssFiles = [
    'src/styles/normalize.css',
    `./src/styles/${mainCssFile_Name}`
];

//Такс для конкатенации стилей в финальную папку
function cssConcat(cb) {
    src(cssFiles)
        .pipe(concat(mainCssFile_Name))
        .pipe(dest('./build/styles/'))
        .pipe(browserSync.stream());
    cb();
}

//Таск для финальной минификации стилей (и удаления файлов map)
function cssMinify(cb) {
    src(`./build/styles/${mainCssFile_Name}`)
        .pipe(cleanCSS({
            debug: true,
            level: 2
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(dest('./build/styles/'));
    cb();
}

//Таск для конкатенации и минификации js____________________________________________

//Имя основного финального JS файла
let mainJsFile_name = 'main.js';

//Порядок подключения js файлов для конкатенации
let jsFiles = [
    `./src/scripts/${mainJsFile_name}`
];

//Такс для конкатенации скриптов в финальную папку
function jsConcat(cb) {
    pipeline(
        src(jsFiles),
        (sourcemaps.init()),
        (concat(mainJsFile_name)),
        (sourcemaps.write()),
        (dest('./build/scripts/'))
    );
    cb();
}

//Таск для финальной минификации скриптов (и удаления файлов map)
function jsMinify(cb) {
    src(`./build/scripts/${mainJsFile_name}`)
        .pipe(uglifyEs({
            toplevel: true
        }))
        .pipe(dest('./build/scripts/'));
    cb();
}

//Таск для сжатия изображений и переноса в финальную папку_____________________________
function imgCompress(cb) {
    src('./src/image-min/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(dest('./build/images/'));
    cb();
}

// icon fonts - создание шрифтовых иконок____________________________________________
let fontName = 'icons';

// add svg icons to the folder "icons" and use 'iconfont' task for generating icon font
function createIconfont(cb) {
    // где лежат наши иконки
    src('./src/iconfonts-img/**/*.svg')
        .pipe(iconfontCss({
            // где будет наш scss файл
            targetPath: '../../styles/scss/_icons.scss',
            // пути подлючения шрифтов см. в _icons.scss
            fontPath: '../fonts/iconfonts/',
            fontName: fontName
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            fontHeight: 1001
        }))
        // куда выбрасываем нашу папку с шрифтами
        .pipe(dest('./src/fonts/iconfonts/'));
    cb();
}

//Таски для копирования доп файлов с исходника в проект_______________________________

//Скопировать папку шрифты в финальный проект
function copyFonts(cb) {
    src('./src/fonts/**')
        .pipe(dest('./build/fonts/'));
    cb();
}

//Скопировать изображения в финальный проект (которые не нужно сжимать)
function copyImg(cb) {
    src('./src/images/**')
        .pipe(dest('./build/images/'));
    cb();
}

//Скопировать папку библиотеки в финальный проект
function copyLibs(cb) {
    src('./src/libs/**/*')
        .pipe(dest('./build/libs/'));
    cb();
}

//Таск для очистки папки build________________________________________________________
function cleanProject(cb) {
    del.sync(['./build/**']);
    cb();
}

//Таск для отдельного запуска локального сервера browser-sync
function syncFiles(cb) {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
    cb();
}

//Таск для отслеживания изменений в файлах____________________________________________
function watchFiles(cb) {
    //При изменении HTML запустить синхронизацию
    watch('./src/*.html', htmlMinify);
    //Следить за файлами со стилями с нужным расширением
    watch('./src/styles/scss/**/*.scss', sassConverter);
    watch(cssFiles, cssConcat);
    //Следить за JS файлами
    watch('./src/scripts/**/*.js', jsConcat);
    watch('./src/scripts/**/*.js').on('change', browserSync.reload);
    //Следить за добавлением новых изображений для сжатия
    watch('./src/image-min/**', imgCompress);
    //Следить за добавлением новых иконок для шрифтов
    watch('./src/iconfonts-img/**', createIconfont);
    //Следить за добавлением новых шрифтов
    watch('./src/fonts/**', copyFonts);
    //Следить за добавлением новых изображений
    watch('./src/images/**', copyImg);
    //Следить за добавлением новых библиотек
    watch('./src/libs/**', copyLibs);
    //Reload html page
    // watch("./src/*.html").on('change', browserSync.reload);

    cb();
}

//Быстрая навигация по таскам_____________________________________________________________________

//Минификация и перенос html в финальную папку
exports.htmlMin = htmlMinify;
//Комплиляция scss в css
exports.sass = sassConverter;
//Конкатенация и перенос css в финальную папку
exports.cssConcat = cssConcat;
//Конкатенация и перенос js в финальную папку
exports.jsConcat = jsConcat;

//Минификация стилей и удаление Map, в финальном файле
exports.cssMin = cssMinify;
//Минификация скриптов и удаление Map, в финальном файле
exports.jsMin = jsMinify;

//Сжатие и перенос изображений в финальную папку
exports.imgCompress = imgCompress;
//Создание шрифтовых иконок
exports.createIconfont = createIconfont;

//Перенос всех доп файлов (папки шришты, картинки, библиотеки...) в финальную папку________________
//Перенос шрифтов в финальную папку
exports.exportFonts = copyFonts;
//Перенос изображений, которые не нужно сжимать в финальную папку
exports.exportImg = copyImg;
//Перенос библиотек в финальную папку
exports.exportLibs = copyLibs;
//Перенос основных файлов за раз, добавлять опционально что нужно
exports.exportAll = parallel(copyFonts, copyImg, copyLibs);

//Слежение за изменениями файлов при разработке с их авто применением
exports.watch = watchFiles;
//Запуск локального сервера browser-sync
exports.runSync = syncFiles;
//Слежение за изменениями файлов при разработке с их авто применением на локальном сервере browser-sync
exports.liveWatch = parallel(watchFiles, syncFiles);

//Очистка папки build (папки готового проекта)
exports.cleanProject = cleanProject;

//Построения финальной папки проекта со всеми основными папками и файлами, созданными на момент выполнения
//Использовать лучше после предварительного удаления финальной папки, чтобы удалить лишние файлы (если есть)
//или при первом развёртывании проекта
exports.createProject = parallel(htmlMinify, jsConcat, imgCompress, series(createIconfont, sassConverter, cssConcat, exports.exportAll));
//Очистка папки проекта с последующим переносом всех необходимых данных (обновление актуальности проекта)
exports.recreateProject = series(cleanProject, exports.createProject);


//___DEFAULT______________________________________________________________________________________________
//Очистка финальной папки, перенос в неё всех акуальных папок и файлов,
//запуск отслеживания изменений в файлах liveWatch, в локальнос сервере browserSync,
//можно сменить на watch если нужна "тихая" работа (без релоада браузера)
exports.default = series(exports.recreateProject, exports.liveWatch);

//Минификация стилей, скритов и удаление Map, в финальном файле
//*************************************************************************************************
//ПОСЛЕ ЗАВЕРШЕНИЯ РАБОТЫ ЗАПУСТИТЬ ЭТОТ ТАСК, ОПТИМИЗИРУЕТ И СЖИМАЕТ СКРИПТЫ, СТИЛИ И УДАЛЯЕТ МАПЫ
exports.minifyAll = parallel(cssMinify, jsMinify);
//*************************************************************************************************
