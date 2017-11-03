require! <[ express path ]>
const app = express!
const port = 3000

app
  ..set 'view engine' \pug
  ..set \views path.join __dirname, \views
  ..use express.static \public
  ..get \/ (, res) !-> res.render \index
  ..listen port, (err) !->
    if err
      console.error "Something bad happened" err
      return
    console.log "Server listening on #port"
