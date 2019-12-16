const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
let members = require('./Members');

const PORT = process.env.PORT || 5000;
const app = express();

// Init logger middleware
app.use(logger);
// Init Body Parser midlleware - allow to handle JSON submissions
app.use(express.json());
// Init forms middleware - allow to handle forms submissions
app.use(express.urlencoded({ extended: false }));
//Init handlebards middleware;
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Handlebars homepage view
app.get('/', (req, res) => res.render('index', {
    title: 'Some fancy title',
    members,
}));

// Set static folder for static common files
/////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     // res.send('<h1>Hello World</h1>');
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });s

app.use('/api/members', require('./routes/api/members'));

app.listen(PORT, () => {
    console.warn(`Server listening on port ${PORT}...`);
    console.warn(`http://localhost:${PORT}`);
});
