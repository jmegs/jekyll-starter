# Jekyll Starter

Base for static sites using Jekyll for generating content and Gulp to compile Stylus, bundle Javascript with Webpack, and run a Browsersync server.

It appears to work…

## Organization
Edit styles, scripts, and images in `/_src`.

Gulp will process them, inject them into `/_site` so Browsersync notices them, and copy the processed output to `/assets`, which gets picked up by jekyll the next time any html changes.

## Installation

```bash
# Git Clone
rm -rf .git
git init

# install dependencies
yarn

# run dev server
yarn start
```