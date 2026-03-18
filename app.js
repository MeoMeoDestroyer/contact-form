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

// portfolio
app.get('/portfolio', (req, res) => res.render('portfolio'));

//contact-form is the form page
app.get('/contact-form', (req, res) => {
  res.render('contact-form', { errors: [], old: {}});
});

// server side validation
const validHowMet = ['conference', 'networking', 'referral', 'linkedin', 'work', 'other'];
const validEmailFormat = ['html', 'text'];
 
app.post('/submit', async (req, res) => {
  const {
    firstName, lastName, jobTitle, company,
    linkedin, email, howMet, howMetOther,
    message, mailingList, emailFormat
  } = req.body;
 
  const errors = [];
 
  if (!firstName || !firstName.trim())
    errors.push('First name is required.');
 
  if (!lastName || !lastName.trim())
    errors.push('Last name is required.');
 
  if (!howMet || !validHowMet.includes(howMet))
    errors.push('Please select how we met.');
 
  if (linkedin && linkedin.trim() && !linkedin.trim().startsWith('https://linkedin.com/in/'))
    errors.push('LinkedIn URL must start with https://linkedin.com/in/');
  if (mailingList === 'yes') {
    if (!emailFormat || !validEmailFormat.includes(emailFormat))
      errors.push('Please select a valid email format (HTML or Text) for the mailing list.');
  }

  if (errors.length > 0) {
    return res.status(422).render('contact-form', { errors, old: req.body });
  }
  // save to database here
  try {
  const sql = `INSERT INTO contacts (firstName, lastName, jobTitle, company, linkedinUrl, emailAddress, howDidWeMeet, otherSpecify, message, mailingList,emailFormat) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
  const params = [
firstName.trim(),
  lastName.trim(),
  jobTitle || '',
  company  || '',
  linkedin || '',
  email    || '',
  howMet,
  howMetOther || '',
  message  || '',
  mailingList === 'yes' ? 'yes' : 'no',
  emailFormat || 'html'
];

    const [result] = await pool.execute(sql, params);
    console.log('Contact saved with ID:' , result.insertId);

    res.render('confirmation', {
      submission: {
       firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email || '' 
      }});
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

// db-test
app.get ('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

// 404 page not found , then go back home
app.use((req, res) => {
  res.status(404).send('<h1>404 – Page Not Found</h1><a href="/">← Back to Home</a>');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});
