const express = require("express");
const bodyParser = require("body-parser");
// const bot = require("./services/botService");
require("./bot");
// const {b2cBot, p2cBot} = require('./services/botService');
const app = express();
app.use(bodyParser.json());

const token = process.env.TOKEN;
// const P2C_TOKEN = process.env.P2C_TOKEN;

// const webhookUrl = `${process.env.WEBHOOK_URL}/bot${token}`;
// bot.setWebHook(webhookUrl);
//

// app.post(`/bot${P2C_TOKEN}`, (req, res) => {
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });
//
// app.post(`/bot${token}`, (req, res) => {
//   p2cBot.processUpdate(req.body);
//   res.sendStatus(200);
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});
