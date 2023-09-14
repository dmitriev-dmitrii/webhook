var express = require('express');
var router = express.Router();
var { getConnectionsList } = require('../connections')
const axios = require("axios");
const { APP_ACCESS_TOKEN } = process.env
router.get("/webhook", async (req, res) => {

  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/

  // Parse params from the webhook verification request

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  const params = req.query;
  // console.log(params);

  // const res2 = await axios(
  //     `${resendLocalTonelUrl}`,
  //     { params }
  // );

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

router.post("/webhook", async (req, res) => {
  const {body} = req

  if (!body.object) {
    res.sendStatus(404)
    return
  }

  if (
      !req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
  ) {
    res.sendStatus(200)
    return
  }

  const message = body?.entry[0]?.changes[0]?.value?.messages[0]

  const urlsData = await getConnectionsList()

  if (!urlsData.length) {
    res.sendStatus(200);
    return
  }

  const {from} = message;

  const  targetIndex =  urlsData.findIndex((item)=> {
    return   item.phoneNumber === from
  })

  if (!targetIndex > 0) {

  await  axios({
      method: "POST",
      url: urlsData[targetIndex],
      data: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });
  }

  res.sendStatus(200);
});


module.exports = router;
