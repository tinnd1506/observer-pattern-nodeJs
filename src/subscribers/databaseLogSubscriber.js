const db = require("../db");

module.exports = function databaseLogSubscriber(data) {
  db.run(
    `INSERT INTO resources (name, createdAt) VALUES (?, ?)`,
    [data.name, data.createdAt],
    function (err) {
      if (err) {
        return console.error("Error inserting data:", err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
}; 