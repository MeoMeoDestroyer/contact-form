// Import the express module
import express from 'express';
import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

// Create an instance of an Express application
const app = express();
const PORT = 3005;

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Define a default "route" ('/')
app.use(express.static('public'));

//set ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// home.html is the resume 
app.get('/', (req, res) => {
   res.redirect('/home')
});
app.get('/home', (req, res) => {
  res.render('home');
});
//contact-form is the form page
app.get('/contact-form', (req, res) => {
  res.render('contact-form');
});

app.post('/submit', async (req, res) => {
  try {
  const sql = `INSERT INTO contacts (firstName, lastName, jobTitle, company, linkedinUrl, emailAddress, howDidWeMeet, otherSpecify, message, mailingList,emailFormat) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
  const params = [
    req.body.firstName,
    req.body.lastName,
    req.body.jobTitle,
    req.body.company,
    req.body.linkedinUrl,
    req.body.emailAddress,
    req.body.howDidWeMeet,
    req.body.otherSpecify,
    req.body.message,
    req.body.mailingList || 'no',
    req.body.emailFormat
    ];

    const [result] = await pool.execute(sql, params);
    console.log('Contact saved with ID:' , result.insertId);
    const submission = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress
    };
    res.render('confirmation', {submission});
  } catch (err) {
     console.error('Error saving contact:', err);
    res.status(500).send('Error saving contact. Please try again.');
  }
});
    // Confirmation.html
app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

//admin routes
app.get('/admin', async (req, res) => {
  try {
    const [contact] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');
    res.render('admin', {submissions: contact});
  } catch (err) {
    console.error ('Database error:', err);
    res.status(500).send('Error loading contacts: ' +err.message);
  }
    
});

app.get ('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});
// Start the server and listen on the specified port

  
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});
