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
const concat = require('gulp-concat');
var argv = require('minimist')(process.argv.slice(2));


/*=============== SETUP VARIABLES ======================================= */
const deployProjectName = 'online-zoo/';
const deployFullPath = {cwd:'/ram/ramdisk/PetStory/deploy'};
const srcPath = 'src/';
const distPath = 'dist/';
const deployPath = "../deploy/";
const gitHubBranch = 'gh-pages';
/* const sourceBackup = "../../**"; */
const sourceBackup = ["../../**", '!**/node_modules/**'];
const gitBackup = ["../../**/.git","../../**/.git/**"]
const destinationBackup ="../../../ramdisk_backup/";
let indexPage = "index.html";
let scripts = ['home.js','map.js','zoos.js','donate.js']


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
    indexcss:srcPath + "*.css",
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
    allFiles: ["../**", "!../**/node_modules","!../**/node_modules/**"],
    git: "../**/.git/**"
  },
}

const jsScriptsPath = []
scripts.forEach(script =>{
  let fullPath = srcPath + "assets/js/" + script;
  jsScriptsPath.push(fullPath)
})

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
          filename: 'home.js',
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
          filename: 'home.js',
        }
      }))
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function jsConcatWatch(cb) {
  return src(jsScriptsPath)
      .pipe(plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "JS Error",
            message: "Error: <%= error.message %>"
          })(err);
          this.emit('end');
        }
      }))
      /* .pipe(concat('script.js')) */
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function images(cb) {
  return src(path.src.images)
      .pipe(dest(path.build.images))
      .pipe(browserSync.reload({stream: true}));

  cb();
}

function imagesDeploy(cb) {
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
  gulp.watch([path.watch.js], jsConcatWatch);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  const fileWatcher =  gulp.watch(path.watch.allFiles, { delay: 2500 }, backupFiles);
  const gitWatcher =  gulp.watch([path.watch.git], { delay: 6500 }, backupGit);

  gitWatcher.on('all', function (event, filePath) {
    console.log('git DELETED ==== ', filePath);
    del([destinationBackup + '**/.git/',destinationBackup + '**/.git/**'], {force: true})
  })


  fileWatcher.on('all', function (event, filePath) {
    console.log(filePath);
    if (event === 'unlink') {
      /* if file deleted, delete in backup folder */
      let deleteFile = destinationBackup + '**'+ filePath.substring(2);
    console.log('file for deletion: ', deleteFile);
    del(deleteFile, {force: true})
    }
  })
}

/* =========== BUILD FUNCTIONS =========================================== */

function copyIndexHtml(cb) {
  return src(path.src.html)
      .pipe(dest(distPath));
  cb();
}

function copyIndexCSS(cb) {
  return src(path.src.indexcss)
      .pipe(dest(distPath));
  cb();
}

function cleanDist(cb) {
  return del(distPath + '**', {force: true});
  cb();
}


/* delete .git folders in backup folder */
function cleanBackupGit(cb) {
  console.log('CLEAN BACKUP GIT');
  del([destinationBackup + '**/.git/',destinationBackup + '**/.git/**'], {force: true})
  cb();
}

/* clean backup folder */
function cleanAll(cb) {
  console.log('CLEAN BACKUP GIT');
  del([destinationBackup + '**/**',destinationBackup + '**/*'], {force: true});
  cb();
}



/* =========== BACKUP FILES      ========================================= */
function backupFiles(cb) {
  console.log('BaCKUP files');
  return src(sourceBackup)
      .pipe(dest(destinationBackup, {force: true}) );
  cb();
}

function backupGit(cb) {
  del([destinationBackup + '**/.git/',destinationBackup + '**/.git/**'], {force: true})

  console.log('BaCKUP GIT');
  return src(gitBackup)
      .pipe(plumber())
      .pipe(dest(destinationBackup, {force: true}))
      .pipe(plumber());
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
  return del([deployPath +deployProjectName + '**','!'+deployPath +'.git'], {force: true});
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
  .pipe(plumber())
  .pipe(git.push('origin',gitHubBranch,deployFullPath,function (err) {
    if (err) console.log(err);
}))
.pipe(plumber());

  cb();
}

/* ======================================================================= */




const deploy = gulp.series(cleanDeploy,imagesDeploy, copyFilesToDeploy, add, commit, push);
const build = gulp.series(cleanAll, cleanDist,copyIndexHtml,copyIndexCSS, gulp.parallel(html, css, jsConcatWatch ,/* js, */ images, fonts),backupGit);
const watch = gulp.parallel(build, watchFiles, serve);



/*--------------------- Exports Tasks -------------------------------------*/

exports.deploy = deploy;
exports.default = watch;
