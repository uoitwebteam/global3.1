import plugins       from 'gulp-load-plugins';
import yargs         from 'yargs';
import browser       from 'browser-sync';
import php           from 'gulp-connect-php';
import gulp          from 'gulp';
import panini        from 'panini';
import rimraf        from 'rimraf';
import sherpa        from 'style-sherpa';
import yaml          from 'js-yaml';
import fs            from 'fs';
import webpackStream from 'webpack-stream';
import webpack2      from 'webpack';
import named         from 'vinyl-named';
import autoprefixer  from 'autoprefixer';
import merge         from 'merge-stream';
import imagemin, { gifsicle }      from 'gulp-imagemin';


const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');
const sassBuilds = {
	sassdefault: ['global3.1','docs'], // For faster development builds, change this default build task to your current needs
	sassall: ['global3.1','docs','map',], 
};
// const sassTasks = ['sassdefault', 'sasscustom', 'sassdocs'];

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
function loadConfig() {
  const unsafe = require('js-yaml-js-types').all;
  const schema = yaml.DEFAULT_SCHEMA.extend(unsafe);
  const ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile, {schema});
}
const { PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

console.log(UNCSS_OPTIONS);

// Build the "dist" folder by running all of the below tasks
// Sass must be run later so UnCSS can search for used classes in the others assets.
gulp.task('build',
  gulp.series(clean, gulp.parallel(pages, javascript, images, docsImages, copy), sassBuild, styleGuide)
);

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch)
);


// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/files'));
}

// Copy page templates into finished HTML files
function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars,php}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

// Generate a style guide from the Markdown content and HTML template in styleguide/
function styleGuide(done) {
  sherpa('src/styleguide/index.md', {
    output: PATHS.dist + '/styleguide.html',
    template: 'src/styleguide/template.html'
  }, done);
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sassBuild(done) {
  const postCssPlugins = [
    // Autoprefixer
    autoprefixer(),
    // UnCSS - Uncomment to remove unused styles in production
    // PRODUCTION && uncss(UNCSS_OPTIONS),
	].filter(Boolean);

	// In production, compile all Sass builds, otherwise only build default
	const whichBuilds = (PRODUCTION) ? sassBuilds['sassall'] : sassBuilds['sassdefault'];
	console.log(whichBuilds);

	let builds = whichBuilds.map(file => {
		console.log(file);
		return gulp.src(PATHS.sassbuilds + file + '.scss') 
			.pipe($.sourcemaps.init())
			.pipe(sass({
				includePaths: PATHS.sass
			})
			.on('error', $.sass.logError))
			.pipe(postcss(postCssPlugins))
			.pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie11' })))
			.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
			.pipe(gulp.dest(PATHS.dist + '/files/css'))
			.pipe(browser.reload({ stream: true }));
	});
	return merge(builds);

	


	// whichBuilds.forEach(buildName => {
	// 	return gulp.src(PATHS.sassbuilds + buildName + '.scss') //'src/files/scss/global3.1.scss'
	// 		.pipe($.sourcemaps.init())
	// 		.pipe(sass({
	// 			includePaths: PATHS.sass
	// 		})
	// 		.on('error', $.sass.logError))
	// 		.pipe(postcss(postCssPlugins))
	// 		.pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie11' })))
	// 		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
	// 		.pipe(gulp.dest(PATHS.dist + '/files/css'))
	// 		.pipe(browser.reload({ stream: true }));		
	// }, done);
}

// Build Sass files only
gulp.task('sass',
  gulp.series(sassBuild)
);


/* 
// Individual Sass builds (quick one-off builds)
const postCssPlugins = [
	// Autoprefixer
	autoprefixer(),
	// UnCSS - Uncomment to remove unused styles in production
	// PRODUCTION && uncss(UNCSS_OPTIONS),
].filter(Boolean);

// Define individual Sass tasks (for quick, one-off builds)
const sassTaskFactory = taskName => () => gulp.src(PATHS.sassbuilds + sassBuilds[taskName] + '.scss') 
			.pipe($.sourcemaps.init())
			.pipe(sass({
				includePaths: PATHS.sass
			})
			.on('error', $.sass.logError))
			.pipe(postcss(postCssPlugins))
			.pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie11' })))
			.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
			.pipe(gulp.dest(PATHS.dist + '/files/css'))
			.pipe(browser.reload({ stream: true }));

sassTasks.forEach(taskName => {
	const task = sassTaskFactory(taskName);
	gulp.task(taskName, task);
}); */


let webpackConfig = {
  mode: (PRODUCTION ? 'production' : 'development'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ "@babel/preset-env" ],
            compact: false
          }
        }
      }
    ]
  },
  devtool: !PRODUCTION && 'source-map'
}

// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.entries)
    .pipe(named())
    .pipe($.sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe($.if(PRODUCTION, $.terser()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/files/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/files/img/**/*')
    .pipe($.if(PRODUCTION, imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 85, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ])))
    .pipe(gulp.dest(PATHS.dist + '/files/img'));
}

// Docs/Kitchen sink static assets
function docsImages() {
	return gulp.src('src/files/img/kitchen-sink/**/*')
    .pipe($.if(PRODUCTION, imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 85, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ])))
    .pipe(gulp.dest(PATHS.dist + '/kitchen-sink/assets'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
	/* php.server({
		base: '.',
		keepalive: true, 
		port: 8888,
	}); 
	browser.init({
		port: 8000,
		proxy: "localhost:8888/global/global3.1/dist/",
	}, done); */

	/* php.server({
		base: './global/global3.1/dist',
		keepalive:true, 
		hostname: 'localhost', 
		port:8000, 
		open: false
	}, function() {
			browser({
					proxy:'localhost:8888'
			});
	}, done); */

	php.server({
		base: PATHS.dist,
		port: PORT
	}, function () {
		browser.init({
			proxy: `localhost:8888/global/global3.1/dist/`
		}, done);
	});
	
	/* browser.init({
		port: PORT,

		// Default web server 
		server: PATHS.dist,
		
		// To enable PHP via your local MAMP server
		// proxy: "localhost:8888/global/global3.1/dist/",
  }, done); */
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);
  gulp.watch('src/pages/**/*.{html,php}').on('all', gulp.series(pages, browser.reload));
  gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
  gulp.watch('src/data/**/*.{js,json,yml}').on('all', gulp.series(resetPages, pages, browser.reload));
  gulp.watch('src/helpers/**/*.js').on('all', gulp.series(resetPages, pages, browser.reload));
  gulp.watch('src/files/scss/**/*.scss').on('all', sassBuild);
  gulp.watch('src/files/js/**/*.js').on('all', gulp.series(javascript, browser.reload));
  gulp.watch('src/files/img/**/*').on('all', gulp.series(images, browser.reload));
  gulp.watch('src/files/kitchen-sink/**').on('all', gulp.series(docsImages, browser.reload));
  gulp.watch('src/styleguide/**').on('all', gulp.series(styleGuide, browser.reload));
}
