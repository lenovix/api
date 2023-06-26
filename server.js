const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db");

const app = express();
const port = 3000;

// app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Query ke database untuk mencocokkan email dan password
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      console.error("Error executing login query:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while executing login query" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    // Jika login berhasil, Anda dapat mengirimkan token otentikasi atau respon sukses lainnya
    console.log("berhasil login");
    return res.status(200).json({ message: "Login successful", user });
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Memasukkan data pengguna baru ke database
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  connection.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user" });
    } else {
      res.json({ message: "Registration successful" });
    }
  });
});

app.post("/request_unit", (req, res) => {
  const { user_id, address, situation, unit } = req.body;
  const status = "Pending";

  // Lakukan validasi data

  // Lakukan operasi untuk menyimpan data ke tabel request_unit di database

  // Contoh menggunakan MySQL
  const query = `INSERT INTO request_unit (user_id, address, situation, unit, status) VALUES (?, ?, ?, ?, ?)`;
  const values = [user_id, address, situation, unit, status];

  // Lakukan eksekusi query ke database
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Failed to register request unit" });
    }

    return res
      .status(200)
      .json({ message: "Request unit registered successfully" });
  });
});

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) throw error;
      res.send("Pengguna telah dihapus");
    }
  );
});

// for Emergency unit
app.post("/loginEU", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Query ke database untuk mencocokkan email dan password
  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      console.error("Error executing login query:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while executing login query" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    // Jika login berhasil, Anda dapat mengirimkan token otentikasi atau respon sukses lainnya
    console.log("berhasil login");
    return res.status(200).json({ message: "Login successful", user });
  });
});

// Ambulance
app.get("/panggilan-ambulan", (req, res) => {
  // const query = 'SELECT * FROM request_unit WHERE unit = "Ambulance" AND status = "Pending"';
  // const query = 'SELECT request_unit.*, users.user_id FROM request_unit JOIN users ON request_unit.user_id = users.user_id WHERE request_unit.unit = "Ambulance"';
  const query =
    "SELECT request_unit.*, users.name AS nama_pengguna FROM request_unit INNER JOIN users ON request_unit.user_id = users.user_id WHERE request_unit.unit = 'Ambulance' AND status = 'Pending'";

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error retrieving data: ", error);
      res.status(500).json({ message: "Error retrieving data" });
    } else {
      res.json(results);
    }
  });
});
