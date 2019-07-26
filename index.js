'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');

// create LINE SDK client
const client = new line.Client(config);

const app = express();

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
   // req.body.events should be an array of events
   if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
   }
   // handle events separately
   Promise.all(req.body.events.map(event => {
      console.log('event', event);
      // check verify webhook event
      if (event.replyToken === '00000000000000000000000000000000' ||     
          event.replyToken === 'ffffffffffffffffffffffffffffffff') {
          return;
      }
      return handleEvent(event);
   }))
   .then(() => res.end())
   .catch((err) => {
      console.error(err);
      res.status(500).end();
   });
});
