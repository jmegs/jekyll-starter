// Gotta have gulp
import gulp from "gulp"

// Server
import bs from "browser-sync"

// Styles
import stylus from "gulp-stylus"
import poststylus from "poststylus"
import rupture from "rupture"
import prefix from "autoprefixer"
import cleanCSS from "gulp-clean-css"
import rename from "gulp-rename"

// JS
import webpack from "webpack-stream"

// Utils
import del from "del"
import cp from "child_process"

// Error handling
import gutil from "gulp-util"
import plumber from "gulp-plumber"
import notify from "gulp-notify"

// initialize browser sync as bs
const browserSync = bs.create()

// Tell gulp where all the files are in one place
const paths = {
  styles: {
    src: "src/css/**/*.styl",
    dest: "site/assets/css/",
    inject: "dist/assets/css/"
  },
  scripts: {
    src: "src/js/app.js",
    dest: "site/assets/js/",
    inject: "dist/assets/scripts/"
  },
  images: {
    src: "src/img/**/*",
    dest: "site/assets/img/"
  },
  jekyll: ["site/**/*.html", "site/**/*.md", "site/_projects/*"]
}

// nuke the assets folder
// because of a bug in del, you have to ignore the parent explicitly
export const clean = () => del(["dist", "site/assets/**", "!site/assets"])

// Error handler
// props to Brendan Falkowski
// https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-268852774
const handleError = error => {
  const chalk = gutil.colors.red
  let message = chalk(`${error.message.split("\n")[0]}`)

  notify({
    title: chalk(`${error.plugin} error!`),
    message: `\n at ${message}`,
    sound: "Sosumi"
  }).write(error)
}

// compile styles in dev
export function styles() {
  return gulp
    .src(paths.styles.src, { sourcemaps: true })
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(stylus({ use: [rupture(), poststylus([prefix])] }))
    .pipe(cleanCSS())
    .pipe(rename({ basename: "main", suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.inject))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(paths.styles.dest))
}

// Move images
export function images() {
  return gulp
    .src(paths.images.src)
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(gulp.dest(paths.images.dest))
}

// Bundle JS and transpile with Babel
export function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest(paths.scripts.inject))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest(paths.scripts.dest))
}

// Build Jekyll incrementally
export function jekyll() {
  return cp
    .spawn("jekyll", ["build", "--incremental", "--quiet"])
    .on("close", code => {
      if (code !== 0) {
        console.error(`jekyll failed with code ${code}`)
      }
      browserSync.reload()
    })
}

// Full Jekyll build
export function jekyll_once() {
  return cp.spawn("jekyll", ["build"]).on("close", code => {
    if (code !== 0) {
      console.error(`jekyll failed with code ${code}`)
    }
  })
}

export function watch() {
  browserSync.init({ server: { baseDir: "dist" } })
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.jekyll, jekyll)
}

// Creates an initial build of the site
export const build = gulp.series(
  clean,
  jekyll_once,
  gulp.parallel(styles, scripts)
)

// Builds once then watches for changes
export const dev = gulp.series(build, watch)

// Sets default task to dev
gulp.task("default", dev)
