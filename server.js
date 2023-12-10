const express = require('express');

const app = express();

const PORT = 6000; 

app.get('/', (req, res) => {
  res.send('Välkommen till min Node.js gästbok och forum!');
});

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
