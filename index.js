const express = require("express");

const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion } =
  require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mango.ray55dg.mongodb.net/?retryWrites=true&w=majority&appName=Mango`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const doctorsCollection =
      client
        .db("docAppointDB")
        .collection("doctors");

    app.get("/doctors", async (req, res) => {
      const result =
        await doctorsCollection.find().toArray();

      res.send(result);
    });

    await client
      .db("admin")
      .command({ ping: 1 });

    console.log(
      "MongoDB Connected Successfully"
    );
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doc Appoint Server Running");
});

app.listen(port, () => {
  console.log(
    `Server running on port ${port}`
  );
});