const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const PORT = 8080; 

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const GUESTBOOK_PATH = path.join(__dirname, 'guestbook.json');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.post('/post-message', (req, res) => {
    
    const { name, phone, email, message } = req.body;
    const newEntry = { name, phone, email, message };
  
    fs.readFile(GUESTBOOK_PATH, (err, data) => {
      if (err && err.code === 'ENOENT') {
       
        fs.writeFile(GUESTBOOK_PATH, JSON.stringify([newEntry]), err => {
          if (err) throw err;
          console.log('Inlägg sparat.');
        });
      } else if (data) {
       
        const entries = JSON.parse(data);
        entries.push(newEntry);
        fs.writeFile(GUESTBOOK_PATH, JSON.stringify(entries), err => {
          if (err) throw err;
          console.log('Inlägg tillagt.');
        });
      }
    });
  
    res.redirect('/');
  });

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
