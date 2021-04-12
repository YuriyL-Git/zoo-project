"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require('gulp-dart-sass');
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require("browser-sync").create();
const git = require('gulp-git');
var argv = require('minimist')(process.argv.slice(2));


/*=============== SETUP VARIABLES ======================================= */
const srcPath = 'src/';
const distPath = 'dist/';
const deployPath = "../deploy/";
const deployProjectName = 'online-zoo';
const deployFullPath = {cwd:'/ram/ramdisk/PetStory/deploy'};
const gitHubBranch = 'gh-pages';
/* const sourceBackup = "../../**"; */
const sourceBackup = ["../../**", "../../**/.git","../../**/.git/**",'!**/node_modules/**'];
const destinationBackup ="../../../ramdisk_backup/";
let indexPage = "index.html";


/* ---------------------------------------------------------------------- */


/* =============== PARAMETERS FROM CONSOLE ================================*/

/* commit message will be read from console with option -c 'commit message' */
let commitMessage = '';
if (argv.c) {
  commitMessage = argv.c;
}

/* ----------------------------------------------------------------------- */


/* ==================== FOLDER STRUCTURE ================================= */
const path = {
  build: {
    html: distPath,
    js: distPath + "assets/js/",
    css: distPath + "assets/css/",
    images: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/"
  },
  src: {
    html: srcPath + "*.html",
    js: srcPath + "assets/js/*.js",
    css: srcPath + "assets/scss/*.scss",
    images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/scss/**/*.scss",
    images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    allFiles: "../**",
    git: "../**/.git/**"
  },
  
}

/* ----------------------------------------------------------------------- */



/* ============================= DEVELOPER TASKS ==========================*/

/* ----------- LIVE SERVER ----------- */
function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
      index: indexPage
    }
    , browser: ["google-chrome" , "firefox"]
  });
}

/* ------------ HTML ------------------*/
function html(cb) {
  panini.refresh();
  return src('src/pages/**/*.{html,hbs,handlebars}')
      .pipe(plumber())
      .pipe(panini({
        root: srcPath+'/pages/',
        layouts: srcPath + 'layouts/',
        partials: srcPath + 'partials/',
        helpers: srcPath + 'helpers/',
        data: srcPath + 'data/'
      }))
      .pipe(dest(path.build.html))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

/* ----------------- CSS -----------------*/
function css(cb) {
  return src(path.src.css, {base: srcPath + "assets/scss/"})
      .pipe(plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SCSS Error",
            message: "Error: <%= error.message %>"
          })(err);
          this.emit('end');
        }
      }))
      .pipe(sass().on('error', sass.logError))
      // .pipe(gulp.dest('./css'))
      .pipe(autoprefixer({
        cascade: true
      }))
      .pipe(cssbeautify({
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
      }))
      .pipe(dest(path.build.css))
      /* .pipe(cssnano({
        zindex: false,
        discardComments: {
          removeAll: true
        }
      })) */
      .pipe(removeComments())
      .pipe(rename({
        suffix: ".min",
        extname: ".css"
      }))
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function cssWatch(cb) {
  return src(path.src.css, {base: srcPath + "assets/scss/"})
      .pipe(plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SCSS Error",
            message: "Error: <%= error.message %>"
          })(err);
          this.emit('end');
        }
      }))
      .pipe(sass({
        includePaths: './node_modules/'
      }))
      .pipe(rename({
        suffix: ".min",
        extname: ".css"
      }))
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function js(cb) {
  return src(path.src.js, {base: srcPath + 'assets/js/'})
      .pipe(plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "JS Error",
            message: "Error: <%= error.message %>"
          })(err);
          this.emit('end');
        }
      }))
      .pipe(webpackStream({
        mode: "production",
        output: {
          filename: 'app.js',
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              query: {
                presets: ['@babel/preset-env']
              }
            }
          ]
        }
      }))
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function jsWatch(cb) {
  return src(path.src.js, {base: srcPath + 'assets/js/'})
      .pipe(plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "JS Error",
            message: "Error: <%= error.message %>"
          })(err);
          this.emit('end');
        }
      }))
      .pipe(webpackStream({
        mode: "development",
        output: {
          filename: 'app.js',
        }
      }))
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function images(cb) {
  return src(path.src.images)
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 80, progressive: true}),
        imagemin.optipng({optimizationLevel: 5})
        /* svgo made problems with svg sprites, creating zero size */
        // ,imagemin.svgo({  
        //   plugins: [
        //     {removeViewBox: true},
        //     {cleanupIDs: false}
        //   ]
        // })
      ]))
      .pipe(dest(path.build.images))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function fonts(cb) {
  return src(path.src.fonts)
      .pipe(dest(path.build.fonts))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], cssWatch);
  gulp.watch([path.watch.js], jsWatch);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  const fileWatcher =  gulp.watch([path.watch.allFiles], { delay: 5000 }, backupFiles);
  const gitWatcher =  gulp.watch([path.watch.git], { delay: 5000 }, backupFiles);

  gitWatcher.on('all', function (event, filePath) {
    console.log('git DELETED ==== ', filePath);
    del(destinationBackup+'**', {force: true})
   
  })


  fileWatcher.on('all', function (event, filePath) {
    if (event === 'unlink') {
    console.log('FILE DELETED ==== ', filePath);
    del(destinationBackup+'**', {force: true})
    }
   // del.sync(destFilePath);
  })
}

/* =========== BUILD FUNCTIONS =========================================== */

function copyIndexHtml(cb) {
  return src(path.src.html)
      .pipe(dest(distPath));
  cb();
}

function cleanDist(cb) {
  return del(distPath + '**', {force: true});
  cb();
}

/* =========== BACKUP FILES      ========================================= */
function backupFiles(cb) {
  return src(sourceBackup)
      .pipe(dest(destinationBackup));
  cb();
}


/* ============ DEPLOY FUNCTIONS ======================================== */

/*-----copy files from dist folder to deploy directory------------- */
function copyFilesToDeploy(cb) {
  return src(distPath + '**/*')
      .pipe(dest(deployPath + deployProjectName));
  cb();
}


/* ----------clean deploy directory */
function cleanDeploy(cb) {
  return del(deployPath +deployProjectName + '**', {force: true});
  cb();
}

/* ---- git add -----------------------*/
function add(cb) {
  console.log('Git add');
  return src('./*', deployFullPath)
  .pipe(git.add(deployFullPath));

  cb();
}

/* ---- git commit -------------------*/
function commit(cb) {
  if (commitMessage === '') {
    console.log('Enter commit message !!!');
    return;
  }
  console.log('Git commit with message: ', commitMessage);
  return src('./*', deployFullPath)
  .pipe(git.commit(commitMessage, deployFullPath));

  cb();
}

/* ---- git push origin -------------*/
function push(cb) {
  return src('./*', deployFullPath)
  .pipe(git.push('origin',gitHubBranch,deployFullPath,function (err) {
    if (err) console.log(err);
}))
.pipe(plumber());

  cb();
}

/* ======================================================================= */




const deploy = gulp.series(cleanDeploy, copyFilesToDeploy, add, commit, push);
const build = gulp.series(cleanDist,copyIndexHtml,  gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);



/*--------------------- Exports Tasks -------------------------------------*/
/* exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch; */
exports.deploy = deploy;
exports.default = watch;
/* exports.cleanDist = cleanDist;
exports.copyIndexHtml = copyIndexHtml;
exports.add = add;
exports.commit = commit;
exports.push = push;
exports.backupFiles = backupFiles; */
