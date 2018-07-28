# NodeConfig
My node package configuration for building WebApps. Including Webpack and it's loaders and plugins.

Write your code into the src folder, following it's logic structure (img, css, js...)
You can place html wherever you want, but you'll have to register it on the Webpack config file, using the function `addPage(path/to/file)` without the file extension. For every html file should exist a js file in `src/js` with the same name (trailing numeration for duplicates `index.html index2.html index3.html ...`).

You can use SASS and any ES version.

`npm init -y && npm i` for a fast startup.
