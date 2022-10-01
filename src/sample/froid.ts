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
  const result = await handleFroidRequest(req.body);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Froid subgraph listening on port ${port}`);
});
