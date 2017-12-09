require! {
  gulp
  'browser-sync': bs
  yargs
}
const args = yargs.argv

bs .= create!

gulp.task \browser-sync !->
  bs.init do
    proxy: \localhost:3000
    files: <[ ./public/css/style.css ./public/js/*.js ./views/index.pug ]>
    open: not args.browser?
    online: no

gulp.task \default <[ browser-sync ]>
