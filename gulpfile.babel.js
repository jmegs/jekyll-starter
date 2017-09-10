import gulp from "gulp"
import bs from "browser-sync"
import stylus from "gulp-stylus"
import poststylus from "poststylus"
import rupture from "rupture"
import prefix from "autoprefixer"
import cleanCSS from "gulp-clean-css"
import rename from "gulp-rename"
import del from "del"
import cp from "child_process"
import webpack from "webpack-stream"

const browserSync = bs.create()

const paths = {
  styles: {
    src: "_src/styles/**/*.styl",
    dest: "assets/styles/",
    inject: "_site/assets/styles/"
  },
  scripts: {
    src: "_src/scripts/app.js",
    dest: "assets/scripts/",
    inject: "_site/assets/scripts/"
  },
  images: {
    src: "_src/images/**/*",
    dest: "assets/images/"
  },
  jekyll: ["*.html", "_layouts/*.html", "_projects/*"]
}

// nuke the assets folder
// because of a bug in del, you have to ignore the parent explicitly
export const clean = () => del(["_site", "assets/**", "!assets"])

// compile styles in dev
export function styles() {
  return gulp
    .src(paths.styles.src, { sourcemaps: true })
    .pipe(stylus({ use: [rupture(), poststylus([prefix])] }))
    .pipe(cleanCSS())
    .pipe(rename({ basename: "main", suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.inject))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(paths.styles.dest))
}

export function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest))
}

export function scripts(cb) {
  return gulp
    .src(paths.scripts.src)
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest(paths.scripts.inject))
    .pipe(browserSync.stream())
    .pipe(gulp.dest(paths.scripts.dest))
}

export function jekyll() {
  return cp
    .spawn("jekyll", ["build", "--incremental", "--quiet"])
    .on("close", code => {
      if (code !== 0) {
        console.log(`jekyll failed with code ${code}`)
      }
      browserSync.reload()
    })
}

export function jekyll_once() {
  return cp.spawn("jekyll", ["build"]).on("close", code => {
    if (code !== 0) {
      console.log(`jekyll failed with code ${code}`)
    }
  })
}

export function watch() {
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.jekyll, jekyll)
}

export function server() {
  browserSync.init({
    server: {
      baseDir: "_site"
    }
  })
}
const init = gulp.series(clean, jekyll_once, gulp.parallel(styles, scripts))

const dev = gulp.series(init, gulp.parallel(watch, server))
gulp.task("dev", dev)
gulp.task("default", dev)
