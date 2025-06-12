const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

app.post('/compress', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(fileBuffer);
    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

    const outputPath = path.join('compressed', `${Date.now()}-compressed.pdf`);
    fs.writeFileSync(outputPath, compressedPdfBytes);

    res.download(outputPath, 'compressed.pdf', () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Compression failed.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});