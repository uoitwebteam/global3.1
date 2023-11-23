# Ontario Tech Sites Global Template - v3.1

## What's changed

v3.1 uses the latest Foundation version, but still employs the [flex grid](https://get.foundation/sites/docs/flex-grid.html). 

Most component styles are visually the same as those in Global 3.0, but are streamlined in this codebase.

Javascript files are compiled using Webpack. 

## Installation

Download 

```bash
git clone https://github.com/uoitwebteam/global3.1
```

Then open the folder in your command line, and install the needed dependencies:

```bash
cd global3.1
yarn
```

Run `yarn start` to run Gulp. Demo pages will be created in the `dist` folder, viewable at this URL:

```
http://localhost:8000
```

To create compressed, production-ready assets, run `yarn run build`.

Upload the compiled CSS and JS files to all relevant servers.

## Development and testing

Running `yarn start` will start a Browsersync web server viewable at http://localhost:8000. However, some site components are PHP-based and will therefore require a proxy to your local web server instance (such as MAMP or WAMP) to properly view and test. 

To enable the proxy, edit the `server()` function in the `gulpfile.babel.js` file. Comment out the default `server` setting line and uncomment the `proxy` setting, changing the value to your MAMP server's host/port settings and the path to your global3.1 installation. It should look something like this:

```js
function server(done) {
	browser.init({
		// Default web server 
		// server: PATHS.dist, port: PORT,
		
		// To enable PHP via your local MAMP server
		proxy: "localhost:0000/path-to-your-installation/global3.1/dist/",
		port: 3000,
  }, done);
}
```

### CSS build files and settings

Multiple CSS files can be built; `.scss` files in the `src/files/scss` folder will be compiled into `.css` files in the `dist/files/css` folder. Add the name of the scss file to the `sassall` array in `gulpfile.babel.js` in order to compile it into CSS:

```js
const sassBuilds = {
	sassdefault: ['global3.1','docs'], // For faster development builds, change this default build task to your current needs
	sassall: ['global3.1','docs','map'],
};
```

For faster builds during local development, the `sassdefault` build task array can be updated on your local machine. E.g., if you are working on `map` styles, you can put this file in `sassdefault` so your development build only compiles this CSS file. However, do not push this line change to GitHub. When you are ready for a production build, all scss files in the `sassall` array will be compiled.

## Documentation

The Kitchen Sink contains examples and documentation of brand elements, typography styles, individual components, and general helpers for development and testing. All Foundation components (except for Orbit) are included in the Global 3.1 build, but not all are documented in the Kitchen Sink. Any Foundation components that are not listed in the Kitchen Sink can be found in the [Foundation docs](https://get.foundation/sites/docs).

The Kitchen Sink is available locally at [http://localhost:8000](http://localhost:8000) and online at [shared.ontariotechu.ca/global/docs/v3.1/kitchen-sink](https://shared.ontariotechu.ca/global/docs/v3.1/kitchen-sink) (compiled pages should be uploaded here).

### Adding/editing components and styles

When updating/adding website components and styles, the component can be tested and updated directly in the Kitchen Sink partials files, as well as on any demo pages for in-page component usage. 

Doc files and demo pages are built using [Foundation's Panini library](https://get.foundation/sites/docs/panini.html), a flat file compiler that runs on the [Handlebars templating engine](https://handlebarsjs.com/). Relevant files are in the following folders:

- `layouts` 
- `pages`
- `partials`
- `data`

***layouts*** contains the base "wrapper" template that each page will use. The Kitchen Sink pages use the `kitchensink.html` layout.

***pages*** contains the individual files that will be rendered as flat file HTML pages. Pages stored in subfolders of the `pages` directory will keep their subdirectory path when the pages are built and rendered. 

***partials*** contains partials, or snippets of HTML, that can be re-used on multiple pages. Component documentation is created in partial files so they can be rendered on individual pages, as well as pulled in on the Kitchen Sink index page. To include partials on a page, use the syntax:

```
{{> name-of-partial-file}}
```

If partials are stored in subfolders of the `partials` directory, the syntax remains the same; the subdirectory path does not need to be included--just use the name of the file.

Learn more about [Panini layouts, pages, and partials](https://zurb.com/university/lessons/156).

***data*** contains data files in either `.yml` or `.json` format. These files contain reusable data content that can be used to render dynamic data across several pages, such as the Kitchen Sink navigation menu, `kitchen-sink.yml`. When new pages/partials are added to the Kitchen Sink, create a new list item in the relevant list section in this file. Items added here will automatically be rendered in the off-canvas navigation menu and on the Kitchen Sink index page (`/pages/index.html`).

Learn more about [Panini data and Handlebars helpers](https://zurb.com/university/lessons/158)

