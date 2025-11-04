const pool = require('../config/db'); // Ensure you import the pool correctly

// Get all patients
exports.getPatients = async (req, res) => {
    try {
        // Execute the query to fetch all patients from the database
        const [rows] = await pool.execute('SELECT * FROM Patients');
        res.json(rows);
    } catch (error) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login
};
