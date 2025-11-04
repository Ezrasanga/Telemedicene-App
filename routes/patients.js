const express = require('express');
const app = express();
const patientRoutes = require('./routes/patients');

app.use('/api', patientRoutes);

// Other middleware and routes can be defined here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
