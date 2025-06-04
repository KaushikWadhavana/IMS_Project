const { MongoClient } = require('mongodb')
const lib = require("express")
const cors = require("cors")
const libRandom = require("randomstring")
const server = lib();
server.use(cors());
server.use(lib.json()); //incoming data will be coverted to JSON

const connection = new MongoClient("mongodb://kaushik:kaushik123@localhost:27017/IMS");
const DB = "IMS";

server.post("/users", async (req, res) => {
  if (req.body.name && req.body.email && req.body.password && req.body.phone) {
    await connection.connect();
    const db = await connection.db(DB);
    const collection = await db.collection('users');
    const result = await collection.find({ email: req.body.email }).toArray();

    if (result.length > 0) {
      res.json({ error: "User already exists" });
    } else {
      await collection.insertOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      });
      res.json({ message: "Success" });
    }
  } else {
    res.json({ error: "All fields required" });
  }
});

server.post("/token", async (req, res) => {
  if (req.body.email && req.body.password) {
    await connection.connect();
    const db = connection.db(DB);
    const collection = db.collection("users");

    const result = await collection
      .find({ email: req.body.email, password: req.body.password })
      .toArray();

    if (result.length > 0) {
      const user = result[0];
      const token = libRandom.generate(7);

      await collection.updateOne(
        { _id: user._id },
        { $set: { authToken: token } }
      );

      res.status(200).json({ token });
    } else {
      res.status(400).json({ error: "Bad request" });
    }
  } else {
    res.status(401).json({ error: "Email and password required" });
  }
});


server.get("/users/roles", async (req, res) => {
  if (req.headers.token) {
    await connection.connect();
    const db = connection.db(DB);
    const collection = db.collection("users");

    const result = await collection
      .find({ "authToken": req.headers.token })
      .toArray();
  }
})

// userList
server.get("/users", (req, res) => {
  const connection = new MongoClient("mongodb://kaushik:kaushik123@localhost:27017/IMS")
  connection.connect().
    then(() => connection.db()).
    then((db) => db.collection('users')).
    then((collection) => collection.find().toArray()).
    // then((result)=>console.log(result)).
    then((result) => res.json(result)). //for peint in html page
    catch((err) => console.log(err))
})


server.listen(8000, () => {
  console.log("server is ready and listening order port 8000");
});
