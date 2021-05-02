const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

console.log(path.join(__dirname, '/'));

app.use(express.static(path.join(`${__dirname}/public`)));

router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/html/index.html`);
});

app.use('/', router);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.info(`App has been started on port ${PORT}...`);
    });
  } catch (err) {
    console.error('Server error', err.message);
    process.exit(1);
  }
};

start();
