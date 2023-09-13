var express = require('express');
var router = express.Router();
var {getConnectionsList, pushToConnectionsList , deleteConnectionByUrl } = require('../connections')

router.get('/', async function(req, res, next) {
    const  connections = await getConnectionsList ()
    res.render('index', { connections } );
});

router.post('/', async function(req, res, next) {
   const {body} = req
    if (body.url && body.phoneNumber) {
        res.send( await pushToConnectionsList(body) )
        return
    }
    res.sendStatus(400)
});

router.delete('/', async function(req, res, next) {
    res.send( await deleteConnectionByUrl(req.body.url) )
});

module.exports = router;
