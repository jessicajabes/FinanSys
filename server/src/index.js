import app from './app.js'

const port = process.env.PORT;


app.get('/', (req, res) => {
  res.send('FinanSys API - server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


