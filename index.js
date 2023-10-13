require('dotenv').config();

const express = require('express');

const { routes } = require('./selling_partner_endpoints/endpoints');

const path = require('path');

const app = express();

const port = (process.env.PORT || 3000);


// settings
app.set('port', port);


// middleware
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (request, response) => {
    response.send("selling-partner api");
});

app.use(routes);


app.listen(app.get('port'), () => {
    console.log(`running in port ${app.get('port')}`);
});
