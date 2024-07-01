const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://ajmora:YyyuPqHLzItIMinE@cluster0.t0p010p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

const SupportCollection = client.db("ticket-generator").collection("supports");

// POST route for adding support
app.post("/support-post", async (req, res) => {
  const userData = req.body;
  userData.date = new Date().toISOString(); // Add the current date
  console.log(userData);
  try {
    const result = await SupportCollection.insertOne(userData);
    console.log(result);
    res.status(200).send({ success: "Support Posted Successfully" });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send({ error: "Failed to post Support" });
  }
});

// GET route for retrieving supports
app.get("/all-supports", async (req, res) => {
  try {
    const supports = await SupportCollection.find({}).toArray();
    res.status(200).json(supports);
  } catch (error) {
    console.error("Error retrieving supports:", error);
    res.status(500).send({ error: "Failed to retrieve supports" });
  }
});

// DELETE route for deleting support
app.delete("/supports/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const result = await SupportCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ success: "Support Deleted Successfully" });
    } else {
      res.status(404).send({ error: "Support Not Found" });
    }
  } catch (error) {
    console.error("Error deleting support:", error);
    res.status(500).send({ error: "Failed to delete support" });
  }
});

app.get("/", (req, res) => {
  res.send("App is Running Successfully");
});
app.get("/test", (req, res) => {
  res.send("Test is Running Successfully");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});


