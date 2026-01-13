const express = require("express");
const { getWords, postWord, putWord, deleteWord } = require("./controllers/wordsController");

const app = express();
app.use(express.json());

app.get("/api/words", getWords);
app.post("/api/words", postWord);
app.put("/api/words/:id", putWord);
app.delete("/api/words/:id", deleteWord);

const port = 3001;
app.listen(port, () => console.log(`API server running at http://localhost:${port}`));