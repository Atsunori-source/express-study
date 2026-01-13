const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// 仮のデータ（DBの代わり）
// DB作成したため、コメントアウト
// const words = [
//   { id: 1, term: "apple", meaning: "りんご" },
//   { id: 2, term: "book", meaning: "本" },
// ];

// 一覧取得API
// 変数からDBに置き換えたため、コメントアウト
// app.get("/api/words", (req, res) => {
//   res.json({ data: words });
// });
app.get("/api/words", (req, res) => {
  db.all("SELECT id, term, meaning FROM words ORDER BY id ASC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB read failed" });
    }
    res.json({ data: rows });
  });
});

// 追加API（単語を追加）
// 変数からDBに置き換えたため、コメントアウト
// function createWord(req, res) {
//   console.log("req.body:", req.body);
//   const { term, meaning } = req.body;

//   // 超簡単なバリデーション
//   if (!term || !meaning) {
//     return res.status(400).json({
//       error: "term と meaning は必須です",
//     });
//   }

//   const newWord = {
//     id: words.length + 1,
//     term,
//     meaning,
//   };

//   words.push(newWord);

//   res.status(201).json({
//     data: newWord,
//   });
// }
function createWord(req, res) {
  const { term, meaning } = req.body;

  if (!term || !meaning) {
    return res.status(400).json({ error: "term と meaning は必須です" });
  }

  const sql = "INSERT INTO words (term, meaning) VALUES (?, ?)";
  db.run(sql, [term, meaning], function (err) {
    if (err) {
      return res.status(500).json({ error: "DB insert failed" });
    }

    res.status(201).json({
      data: { id: this.lastID, term, meaning },
    });
  });
}

app.post("/api/words", createWord);

// 更新API（idで更新）
app.put("/api/words/:id", (req, res) => {
  const id = Number(req.params.id);
  const { term, meaning } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id が不正です" });
  }
  if (!term || !meaning) {
    return res.status(400).json({ error: "term と meaning は必須です" });
  }

  const sql = "UPDATE words SET term = ?, meaning = ? WHERE id = ?";
  db.run(sql, [term, meaning, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "DB update failed" });
    }
    // this.changes は更新された行数
    if (this.changes === 0) {
      return res.status(404).json({ error: "対象の単語が見つかりません" });
    }

    res.json({ data: { id, term, meaning } });
  });
});

// 削除API（idで削除）
app.delete("/api/words/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id が不正です" });
  }

  const sql = "DELETE FROM words WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "DB delete failed" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "対象の単語が見つかりません" });
    }

    // 204 No Content でもいいけど、学習しやすくJSON返す
    res.json({ data: { id } });
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
