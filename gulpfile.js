//import gulp and browser-sync
var gulp = require('gulp');
var browserSync = require('browser-sync')
    .create();

    gulp.task('browserSync', function() {
        browserSync.init({
            "server": {
                "baseDir": "./"
            },
            "ui":{
                "port":3000
            },
            "open": false,
            "notify": false,
            "watch":[
                "./app/**/*.js",
                "./app/**/*.css",
                "./app/**/*.html"
            ]
        });
    });
    gulp.task('default',["browserSync"], function() {
        console.log("AH")
        browserSync.reload()
    });
