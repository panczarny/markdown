require! {
  gulp
  'browser-sync': bs
}

bs .= create!

gulp.task \browser-sync !->
  bs.init do
    proxy: \localhost:3000
    files: <[ ./public/css/style.css ./public/js/*.js ./views/index.pug ]>

gulp.task \default <[ browser-sync ]>
