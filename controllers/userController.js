const pool = require('../db');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid user ID format (UUID required)." });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// POST create user
exports.createUser = async (req, res) => {
  const { nom, prenom, adresse, email, telephone } = req.body;
  if (!nom || !prenom || !adresse || !email || !telephone) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  const dateCreation = new Date();
  try {
    const result = await pool.query(
      `INSERT INTO users (nom, prenom, adresse, email, telephone, date_creation)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [nom, prenom, adresse, email, telephone, dateCreation]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update user
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { nom, prenom, adresse, email, telephone } = req.body;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "ID utilisateur invalide (UUID attendu)." });
  }
  if (!nom || !prenom || !adresse || !email || !telephone) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  try {
    const result = await pool.query(
      `UPDATE users SET nom = $1, prenom = $2, adresse = $3, email = $4, telephone = $5 WHERE id = $6 RETURNING *`,
      [nom, prenom, adresse, email, telephone, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
    res.status(200).json({ message: `Utilisateur modifié (ID: ${id})`, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid user ID format (UUID required)." });
  }
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: `User deleted with ID: ${id}`, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};