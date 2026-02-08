// Import the express module

import express from 'express';


// Create an instance of an Express application

const app = express();


// Define the port number where our server will listen

const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Handle form submission
app.post('/submit', (req, res) => {
  console.log('Form data received:', req.body);
  res.send('<h1>Form submitted successfully!</h1><a href="/">Go back</a>');
});

// Define a default "route" ('/')
app.use(express.static('public'));

// req: contains information about the incoming request

// res: allows us to send back a response to the client

app.get('/', (req, res) => {

  res.sendFile(`${import.meta.dirname}/views/home.html`);

});
// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});