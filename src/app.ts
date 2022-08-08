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

app.get('/templates/files/:templateId',  (req, res) => {

  hellosign.template.files(req.params['templateId'], {file_type: 'pdf'}, function(err, response) {
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