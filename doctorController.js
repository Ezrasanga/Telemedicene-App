const db = require('../config/db'); // Ensure this path correctly points to your database configuration

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        // Execute the query to fetch all doctors from the database
        const [rows] = await db.query('SELECT * FROM doctors'); // Assuming 'doctors' is your table name
        res.status(200).json(rows);
    } catch (error) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
