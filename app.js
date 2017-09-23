const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, err => {
  if (err) {
    console.log('Something bad happened', err);
    return;
  }
  console.log(`Server listening on ${port}`);
});
