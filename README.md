# Jekyll Starter

Base for static sites using Jekyll for generating content and Gulp to compile Stylus, bundle Javascript with Webpack, and run a Browsersync server.

It appears to work…

## Organization
Edit styles, scripts, and images in `/_src`.

Gulp will process them, inject them into `/_site` so Browsersync notices them, and copy the processed output to `/assets`, which gets picked up by jekyll the next time any html changes.

## Installation

```sh
git clone https://github.com/jmegs/jekyll-starter.git PROJECT_DIR
cd PROJECT_DIR
rm -rf .git
git init

# install dependencies
yarn

# run dev server
yarn start
```

## Todo

* Right now the image task only copies images over, it will eventually compress them and set up proper retina resolution copies etc.
* Also exploring ways to pull data in via a request inside the gulpfile that outputs to `_data/data.yml`.