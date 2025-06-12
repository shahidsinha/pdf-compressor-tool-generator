const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/compress', upload.array('pdfs', 3), (req, res) => {
  const compressionLevel = parseInt(req.body.level) || 5;
  const outputPath = path.join(__dirname, 'compressed');

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

  const results = req.files.map((file, index) => {
    const inputPath = file.path;
    const outputFile = path.join(outputPath, `compressed_${index + 1}.pdf`);
    fs.copyFileSync(inputPath, outputFile);
    return `Compressed PDF ${index + 1} saved as ${path.basename(outputFile)}`;
  });

  res.send('<h2>Compression Complete</h2><p>' + results.join('<br>') + '</p><a href="/">Go Back</a>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
