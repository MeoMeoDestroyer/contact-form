// Import the express module

import express from 'express';


// Create an instance of an Express application

const app = express();


// Define the port number where our server will listen

const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Define a default "route" ('/')
app.use(express.static('public'));

const submissions = [];

// home.html
app.get('/', (req, res) => {

  res.sendFile(`${import.meta.dirname}/views/home.html`);

});
// Confirmation.html
app.get('/confirmation', (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});
app.post('/submit', (req, res) => {
  // Create submission object
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
  console.log('Form data received:', submission);
    res.redirect('/confirmation');
  
  app.get('/admin', (req, res) => {
  res.json(submissions);
});
// Start the server and listen on the specified port

  
app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);


});
