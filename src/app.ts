import express from 'express';
require('dotenv').config()
const cors = require('cors');
const hellosign = require('hellosign-sdk')({ key: process.env.HELLOSIGN_KEY });
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");
app.use(bodyParser.json());
app.use(cors())
const port = 3001;

app.get('/', (req, res) => {
  res.send('just a test');
});

app.get('/templates',  (req, res) => {

  hellosign.template.list()
    .then(function(response){
        res.send(response.templates);
      })
    .catch((e) => {
                res.send(e);
            });

  }
);


app.get('/templates/:id',  (req, res) => {

  hellosign.template.get(req.params['id'])
    .then(function(response){
        res.send(response.template);
      })
    .catch((e) => {
                res.send(e);
            });

});


app.post('/sendWithTemplate',  (req, res)=>  {
  const options = req.body;
  hellosign.signatureRequest.sendWithTemplate(options)
    .then(function(response){
        res.send(response.signature_request);
      })
    .catch((e) => {
                res.send(e);
            });
});


app.post('/sendWithTemplateTest',  (req, res)=>  {
  const options = {
  "template_ids": [
    "fddda00dc54276e6a8fa36f6adebdd984470a2f3"
  ],
  "subject": "test template",
  "message": "FRANK TEST.",
  "signers": [
    {
      "role": "Test role",
      "name": "frank",
      "email_address": "franktique@gmail.com"
    }
  ],
  "custom_fields": [
    {
      "name": "Textbox1",
      "value": "my test",//this value needs to be less or equalls to the length defined in the template 
      "editor": "Test role",
      "required": true
    }
  ],
  "signing_options": {
    "draw": true,
    "type": true,
    "upload": true,
    "phone": false,
    "default_type": "draw"
  },
  "test_mode": true
};

  hellosign.signatureRequest.sendWithTemplate(options)
    .then(function(response){
        res.send(response.signature_request);
      })
    .catch((e) => {
                res.send(e);
            });
});

app.post('/embeddedWithTemplate',  (req, res)=>  {
  const options = req.body;
  hellosign.signatureRequest.createEmbeddedWithTemplate(options)
    .then(function(response){
        res.send(response.signature_request);
      })
    .catch((e) => {
                res.send(e);
            });
});


app.post('/embeddedWithTemplateTest',  (req, res)=>  {
  const options = {
  "template_ids": [
    "fddda00dc54276e6a8fa36f6adebdd984470a2f3"
  ],
"clientId" : process.env.INTEGRATION_CLIENT_ID,
  "subject": "test template",
  "message": "FRANK TEST.",
  "signers": [
    {
      "role": "Test role",
      "name": "frank",
      "email_address": "franktique@gmail.com"
    }
  ],
  "custom_fields": [
    {
      "name": "Textbox1",
      "value": "my test",//this value needs to be less or equalls to the length defined in the template
      "editor": "Test role",
      "required": true
    }
  ],
  "signing_options": {
    "draw": true,
    "type": true,
    "upload": true,
    "phone": false,
    "default_type": "draw"
  },
  "test_mode": true
};

  hellosign.signatureRequest.createEmbeddedWithTemplate(options)
    .then(function(response){
        res.send(response.signature_request);
      })
    .catch((e) => {
                res.send(e);
            });
});

app.get('/getSignUrl/:signatureId',  (req, res) => {

  hellosign.embedded.getSignUrl(req.params['signatureId'])
    .then(function(response){
        console.log('The sign url is: ' + response.embedded.sign_url);
        res.send(response.embedded.sign_url);
      })
    .catch((e) => {
                res.send(e);
            });

});

app.get('/getFileBySignatureRequestId/:signatureRequestId',  (req, res) => {


  hellosign.signatureRequest.download(req.params['signatureRequestId'], {file_type: 'pdf'}, function(err, response) {
      if (err) {
        console.log(err)
        res.send(err);
      }
      res.contentType("application/pdf");
      response.pipe(res);

  });
});



app.listen(port, () => {

  return console.log(`server is listening on ${port}`);
});