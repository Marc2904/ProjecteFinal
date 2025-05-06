const db = require("./db");
const bcrypt = require("bcryptjs");

// Funció per registrar un usuari
const registerUser = (username, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hash], (err, result) => {
      callback(err, result);
    });
  });
};

// Funció per fer login
const loginUser = (email, password, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, false);

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback(null, false);
      callback(null, user);
    });
  });
};

module.exports = { registerUser, loginUser };
