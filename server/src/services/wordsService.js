const repo = require("../repositories/wordsRepository");

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    const e = new Error("id が不正です");
    e.status = 400;
    throw e;
  }
  return id;
}

function requireTermMeaning(term, meaning) {
  if (!term || !meaning) {
    const e = new Error("term と meaning は必須です");
    e.status = 400;
    throw e;
  }
}

async function listWords() {
  return repo.findAll();
}

async function createWord(term, meaning) {
  requireTermMeaning(term, meaning);
  return repo.insert(term, meaning);
}

async function updateWord(idParam, term, meaning) {
  const id = parseId(idParam);
  requireTermMeaning(term, meaning);

  const result = await repo.updateById(id, term, meaning);
  if (result.changes === 0) {
    const e = new Error("対象の単語が見つかりません");
    e.status = 404;
    throw e;
  }
  return { id, term, meaning };
}

async function removeWord(idParam) {
  const id = parseId(idParam);

  const result = await repo.deleteById(id);
  if (result.changes === 0) {
    const e = new Error("対象の単語が見つかりません");
    e.status = 404;
    throw e;
  }
  return { id };
}

module.exports = { listWords, createWord, updateWord, removeWord };