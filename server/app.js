const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiErrorHandler = require('./error/apierror-handler');
const ApiError = require('./error/apierror');
const cors = require ('cors');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', '*');
//     res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//     return next();
// });

app.use('/auth', require('./routes/auth-route'));
app.use('/employees', require('./routes/employees-route'));
app.get('/', (req, res, next) => {
  res.send('Hello there!');
})

app.use(function(req, res, next) {
    const err = ApiError.notFound(`The url you are trying to reach is not hosted on the server.`);
    return next(err);
});

app.use(apiErrorHandler);

const PORT = process.env.PORT || 9000;

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.info(`App has been started on port ${PORT}...`);
        });
    } catch (err) {
        console.error('Server error', err.message);
        process.exit(1);
    }
}

start();