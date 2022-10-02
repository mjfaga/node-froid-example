import express from 'express';
import bodyParser from 'body-parser';
import {handleFroidRequest} from '@wayfair/node-froid';

const port = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// No need to run a full GraphQL server.
// Avoid the additional overhead and manage the route directly instead!
app.post('/graphql', async (req, res) => {
  const isPublic = req?.header('supergraph-variant') === 'public';

  let froidOptions = {};
  if (isPublic) {
    console.log('We are service public API. Encrypting key values...');
    froidOptions = {
      encode(value) {
        // Note; this isn't real encryption. See the @wayfair/node-froid
        // repository for examples of how to do this properly
        return Buffer.from(value).toString('base64');
      },
      decode(value) {
        const decoded = Buffer.from(value).toString('ascii');
        return JSON.parse(decoded);
      },
    };
  }

  const result = await handleFroidRequest(req.body, froidOptions);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Froid subgraph listening on port ${port}`);
});
