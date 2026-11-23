const pool = require('../config/db'); // Ensure you import the pool correctly

exports.getPatients = async (req, res) => {
    if (!req.session.adminId) {
        return res.status(401).json({ message: 'Admin login required' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, first_name, last_name, email FROM Patients'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
