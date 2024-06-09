const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t0p010p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let SupportCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    SupportCollection = client.db("ticket-generator").collection("supports");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

// POST route for adding support
app.post("/support-post", async (req, res) => {
  const userData = req.body;
  userData.date = new Date().toISOString();  // Add the current date
  console.log(userData);
  try {
    const result = await SupportCollection.insertOne(userData);
    res.status(200).send({ success: "Support Posted Successfully" });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send({ error: "Failed to post Support" });
  }
});

// GET route for retrieving supports
app.get("/supports", async (req, res) => {
  try {
    const supports = await SupportCollection.find({}).toArray();
    res.status(200).json(supports);
  } catch (error) {
    console.error("Error retrieving supports:", error);
    res.status(500).send({ error: "Failed to retrieve supports" });
  }
});

app.get("/", (req, res) => {
  res.send("App is Running Successfully");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// Gracefully shut down the server and close the MongoDB connection
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await client.close();
  process.exit();
});
