// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Define the port number where our server will listen

const PORT = 3004;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//set ejs as the view engine
app.set('view engine', 'ejs');

// Define a default "route" ('/')
app.use(express.static('public'));

const submissions = [];

// home.html is the resume 
app.get('/', (req, res) => {
  res.render(`${import.meta.dirname}/views/home.ejs`);
});
//contact-form is the form page
app.get('/contact-form', (req, res) => {
  res.render(`${import.meta.dirname}/views/contact-form.ejs`);
});
// Confirmation.html
app.get('/confirmation', (req, res) => {
  res.render(`${import.meta.dirname}/views/confirmation.ejs`);
});
app.post('/submit', (req, res) => {
  const submission = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jobTitle: req.body.jobTitle,
    company: req.body.company,
    linkedinUrl: req.body.linkedinUrl,
    emailAddress: req.body.emailAddress,
    howDidWeMeet: req.body.howDidWeMeet,
    otherSpecify: req.body.otherSpecify,
    message: req.body.message,
    mailingList: req.body.mailingList,
    emailFormat: req.body.emailFormat,
    timestamp: new Date()
  };
  submissions.push(submission);
  console.log('Form received:', submission);
    res.render(`${import.meta.dirname}/views/confirmation.ejs`, {submission});
});
//admin routes
app.get('/admin', (req, res) => {
    res.render('admin', {submissions: submissions});
});
// Start the server and listen on the specified port

  
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});
