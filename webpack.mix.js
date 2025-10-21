const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/login.js', 'public/js')
    .js('resources/js/sidebar.js', 'public/js')
    .js('resources/js/students.js', 'public/js')
    .js('resources/js/faculty.js', 'public/js')
    .js('resources/js/dashboard.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ])
    .postCss('resources/css/login.css', 'public/css', [
        //
    ])
    .postCss('resources/css/dashboard.css', 'public/css', [
        //
    ]);
