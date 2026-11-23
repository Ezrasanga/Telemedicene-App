const db = require('../config/db');

async function listPatients() {
    const [rows] = await db.execute(
        'SELECT id, first_name, last_name, email FROM Patients ORDER BY id DESC'
    );
    return rows;
}

module.exports = { listPatients };
