const db = require("../db");

function findAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, term, meaning FROM words ORDER BY id ASC", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function insert(term, meaning) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO words (term, meaning) VALUES (?, ?)",
      [term, meaning],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, term, meaning });
      }
    );
  });
}

function updateById(id, term, meaning) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE words SET term = ?, meaning = ? WHERE id = ?",
      [term, meaning, id],
      function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes, id, term, meaning });
      }
    );
  });
}

function deleteById(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM words WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes, id });
    });
  });
}

module.exports = { findAll, insert, updateById, deleteById };