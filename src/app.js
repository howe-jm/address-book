require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();

const morganOption =
  NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if (!authToken) {
    return res
      .status(401)
      .json({ message: 'Invalid authenticaion method' });
  }
  if (!authToken.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Invalid authenticaion method',
    });
  }

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res
      .status(401)
      .json({ error: 'Unauthorized request' });
  }
  next();
});
app.use(helmet());
app.use(cors());
app.use(express.json());

const userAddrs = [];

app.post('/address', (req, res) => {
  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
  } = req.body;

  if (!firstName || firstName === '') {
    return res
      .status(400)
      .json({ message: 'First Name required.' });
  }
  if (!lastName || lastName === '') {
    return res
      .status(400)
      .json({ message: 'Last Name required.' });
  }
  if (!address1 || address1 === '') {
    return res
      .status(400)
      .json({ message: 'Address1 required.' });
  }
  if (!city || city === '') {
    return res
      .status(400)
      .json({ message: 'City required.' });
  }
  if (!state || state === '') {
    return res
      .status(400)
      .json({ message: 'State required.' });
  }
  if (state.length !== 2) {
    return res.status(400).json({
      message: `State must be two-character abbreviation. Length: ${state.length}`,
    });
  }

  if (!zip || zip === '') {
    return res
      .status(400)
      .json({ message: 'Zip required.' });
  }
  if (
    typeof zip !== 'number' ||
    zip.toString().length !== 5
  ) {
    return res
      .status(400)
      .json({ message: 'Zip must be a 5-digit number' });
  }

  let id = uuid();
  const newObj = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
  };
  userAddrs.push(newObj);
  res.status(204).end();
});

app.delete('/address/:userId', (req, res) => {
  const { userId } = req.params;
  const index = userAddrs.findIndex(
    (address) => address.id === userId
  );
  if (index === -1) {
    return res
      .status(404)
      .json({ message: 'Address not found.' });
  }

  userAddrs.splice(index, 1);

  res.status(204).end();
});

app.get('/address', (req, res) => {
  res.status(200).json(userAddrs);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = {
      error: { message: 'Internal server error' },
    };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
