var express = require('express');
var router = express.Router();
var { getConnectionsList } = require('../../connections')
const axios = require("axios");
const { APP_ACCESS_TOKEN } = process.env
router.get("/whats-app", async (req, res) => {

  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/

 // Parse params from the webhook verification request

  let mode = req?.query["hub.mode"];
  let token = req?.query["hub.verify_token"];
  let challenge = req?.query["hub.challenge"];

  // Check if a token and mode were sent
  if (!mode || !token) {
    // Check the mode and token sent are correct
    res.sendStatus(403);
    return;
  }

  if (mode === "subscribe" && token === APP_ACCESS_TOKEN) {
    // Respond with 200 OK and challenge token from the request
    console.log("WHATS_APP_WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
    return;
  }

  console.log("WHATS_APP_WEBHOOK_FAILED");
  // Responds with '403 Forbidden' if verify tokens do not match
  res.sendStatus(403);
});

router.post("/whats-app", async (req, res) => {
  const {body} = req

  if (!body.object) {
    res.sendStatus(404)
    return
  }

  const messages = req.body?.entry[0]?.changes[0].value?.messages

  const data = await getConnectionsList()

  if (!data.length || !messages.length) {
    res.sendStatus(200);
    return
  }

  const {from} = messages[0];

  const  targetIndex =  data.findIndex((item)=> {
    return   item.phoneNumber === from
  })

  if (!targetIndex > 0) {

    await  axios({
      method: "POST",
      url: data[targetIndex].url,
      data: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
  }

  res.sendStatus(200);
});


module.exports = router;
