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

  //Gästbokens data och hantering av eventuella fel
  fs.readFile(GUESTBOOK_PATH, (err, data) => {
    if (err) {
    
      if (err.code === 'ENOENT') {
        fs.writeFile(GUESTBOOK_PATH, JSON.stringify([newEntry]), (writeErr) => {
          if (writeErr) {
            console.error('Kunde inte skapa filen:', writeErr);
            return res.status(500).send('Ett serverfel uppstod.');
          }
          console.log('Inlägg sparat.');
          res.redirect('/');
        });
      } else {
       
        console.error('Fel vid läsning av filen:', err);
        return res.status(500).send('Ett serverfel uppstod.');
      }
    } else {
      // lägg till en ny inlägg
      try {
        const entries = JSON.parse(data);
        entries.push(newEntry);
        fs.writeFile(GUESTBOOK_PATH, JSON.stringify(entries), (writeErr) => {
          if (writeErr) {
            console.error('Kunde inte skriva till filen:', writeErr);
            return res.status(500).send('Ett serverfel uppstod.');
          }
          console.log('Inlägg tillagt.');
          res.redirect('/');
        });
      } catch (parseErr) {
        
        console.error('Kunde inte tolka data som JSON:', parseErr);
        return res.status(500).send('Ett fel uppstod.');
      }
    }
  });
});
      
  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servern körs på port ${PORT}`);
});
