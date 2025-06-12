const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { ILovePdf } = require("@ilovepdf/ilovepdf-nodejs");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const publicKey = "project_public_30309b6f324ff5ac2a592fa610b80ff9__whO4c59e695d135fc9723c689545b20ff786";
const ilovepdf = new ILovePdf(publicKey, "my_task_app");

app.post("/compress", upload.array("pdfs", 3), async (req, res) => {
  try {
    const task = ilovepdf.newTask("compress");
    await task.start();

    for (const file of req.files) {
      await task.addFile(file.path);
    }

    await task.process();
    const outputPath = path.join(__dirname, "downloads", `compressed_${Date.now()}.zip`);
    await task.download(outputPath);
    res.download(outputPath, () => fs.rmSync(outputPath, { force: true }));
  } catch (error) {
    console.error(error);
    res.status(500).send("Compression failed.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});