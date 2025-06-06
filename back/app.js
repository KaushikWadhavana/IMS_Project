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
      .find({ authToken: req.headers.token })
      .toArray();

    if (result.length > 0) {
      const user = result[0];

      res.json({
        is_admin: user.is_admin === true,
        playing_for: !!user.playing_for,
        owner_of: !!user.owner_of
      });
    }
  }
});


server.get("/players", async(req, res)=>{

  await connection.connect();
    const db = connection.db(DB);
    const collection = db.collection("users");

    const result = await collection
      .find({ playing_for: { $exists: true } })
      .toArray();
      res.status(200).json(result);
})


server.get("/teams", async (req, res) => {
  await connection.connect();
  const db = connection.db(DB);
  const collection = db.collection("users");

  // Only return users with 'owner_of' field (team owners)
  const result = await collection
    .find({ owner_of: { $exists: true } })
    .toArray();

  res.status(200).json(result);
});

server.post("/add_teams", async (req, res) => {
  if (
    req.body.team_name &&
    req.body.hometown &&
    req.body.slogan &&
    req.body.owner_email
  ) {
    await connection.connect();
    const db = await connection.db(DB);
    const collection = await db.collection("teams");

    const result = await collection
      .find({ team_name: req.body.team_name })
      .toArray();

    if (result.length > 0) {
      res.json({ error: "Team already exists" });
    } else {
      await collection.insertOne({
        team_name: req.body.team_name,
        hometown: req.body.hometown,
        slogan: req.body.slogan,
        owner_email: req.body.owner_email,
      });
      res.json({ message: "Success" });
    }
  } else {
    res.json({ error: "All fields required" });
  }
});

server.post("/add_players", async (req, res) => {
  if (
    req.body.name &&
    req.body.email &&
    req.body.team &&
    req.body.runs &&
    req.body.state &&
    req.body.wickets &&
    req.body.catches &&
    req.body.match
  ) {
    await connection.connect();
    const db = await connection.db(DB);
    const collection = await db.collection("players");

    const result = await collection
      .find({ email: req.body.email })
      .toArray();

    if (result.length > 0) {
      res.json({ error: "Player already exists" });
    } else {
      await collection.insertOne({
        name: req.body.name,
        email: req.body.email,
        team: req.body.team,
        runs: parseInt(req.body.runs),
        state: req.body.state,
        wickets: parseInt(req.body.wickets),
        catches: parseInt(req.body.catches),
        match: parseInt(req.body.match),
      });
      res.json({ message: "Success" });
    }
  } else {
    res.json({ error: "All fields required" });
  }
});

server.get("/team_by_owner", async (req, res) => {
 
  
const email = req.headers['x-owner-email'];
if (!email) {
  return res.status(400).json({ error: "Email header is required" });
}

// rest of your code remains the same


  await connection.connect();
  const db = await connection.db(DB);
  const collection = db.collection("teams");

  const team = await collection.findOne({ owner_email: email });

  if (team) {
    res.json(team);
  } else {
    res.status(404).json({ error: "Team not found" });
  }
});

server.get("/player_detail", async (req, res) => {
 
  
const email = req.headers['player-email'];
if (!email) {
  return res.status(400).json({ error: "Email header is required" });
}

// rest of your code remains the same


  await connection.connect();
  const db = await connection.db(DB);
  const collection = db.collection("players");

  const player = await collection.findOne({ email: email });

  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ error: "Team not found" });
  }
});

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
