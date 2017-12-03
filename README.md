# Vue Base Template

## Features

* Server-side rendering with asynchronous data management
* Prerendering with static-site-generator (suitable for static hosting like GitHub Pages)
* Based on Koa web framework instead of Express
* Creates raster icons of all possible sizes from a single vector image
* Vue-router and Vuex data store included
* Hot module replacement and linting in development
* Clean PostCSS-only solution for styling

## Getting Started

This is a template for [vue-cli](https://github.com/vuejs/vue-cli). Make sure you've installed it, before you go any further:

``` bash
$ npm install -g vue-cli
```

Then you can scaffold the project:

``` bash
$ vue init iloginow/vue-base-template my-project
```

Enter the project directory and install the dependecies:

``` bash
$ cd my-project
$ npm install
```

Finally, run the dev-server:

``` bash
$ npm run dev
```

Hopefully, you'll be able to see the app in your browser at http://localhost:3000

## Commands

| Command | Description |
| --- | --- |
| ``` npm run dev ``` | Start the development server. |
| ``` npm run build ``` | Build the app for production. |
| ``` npm run icons ``` | Generate png icons from an svg image based on icons.json setup. |
| ``` npm run lint ``` | Run [ESLint](https://github.com/eslint/eslint) to examine the /src directory |

> Make sure you've run ``` npm run build ``` before you try one of the following:

| Command | Description |
| --- | --- |
| ``` npm start ``` | Start the production server. |
| ``` npm run generate ``` | Build a static Vue app based on the routes from generator.config.js |

## Structure

    ├── public                  # Will be created by ```npm run build ```
    ├── static                  # Will be created by ```npm run generate ```
    ├── src                     # App source files
    │   ├── components          # All single file components (including App.vue)
    │   ├── images              # Icons and images (audio and video directories can be created if needed)
    │   ├── routes              # Should deliver the routes object for vue-router
    │   ├── store               # Should deliver the store-module (or modules) object for Vuex store
    |   ├── styles              # Contains config files for all PostCSS plugins (fonts, mixins, css-variables etc...) 
    └── ...
