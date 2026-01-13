const service = require("../services/wordsService");

async function getWords(req, res) {
  try {
    const words = await service.listWords();
    res.json({ data: words });
  } catch (err) {
    res.status(500).json({ error: "Unexpected error" });
  }
}

async function postWord(req, res) {
  try {
    const { term, meaning } = req.body;
    const word = await service.createWord(term, meaning);
    res.status(201).json({ data: word });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message ?? "Unexpected error" });
  }
}

async function putWord(req, res) {
  try {
    const { term, meaning } = req.body;
    const word = await service.updateWord(req.params.id, term, meaning);
    res.json({ data: word });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message ?? "Unexpected error" });
  }
}

async function deleteWord(req, res) {
  try {
    const result = await service.removeWord(req.params.id);
    res.json({ data: result });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message ?? "Unexpected error" });
  }
}

module.exports = { getWords, postWord, putWord, deleteWord };