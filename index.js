const express = require("express");

const cors = require("cors");

require("dotenv").config();

const jwt = require("jsonwebtoken");

const cookieParser =
  require("cookie-parser");

const verifyToken = require("./middlewares/verifyToken");

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

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

    console.log(
      "MongoDB Connected Successfully"
    );

    const doctorsCollection =
      client
        .db("docAppointDB")
        .collection("doctors");

    const bookingsCollection =
      client
        .db("docAppointDB")
        .collection("bookings");

    app.post("/jwt", async (req, res) => {
      const user = req.body;

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.send({ token });
    });

    app.get("/doctors", async (req, res) => {
      const result =
        await doctorsCollection.find().toArray();

      res.send(result);
    });

    app.get(
      "/doctors/:id",
      async (req, res) => {
        const id = parseInt(
          req.params.id
        );

        const query = {
          id: id,
        };

        const result =
          await doctorsCollection.findOne(
            query
          );

        res.send(result);
      }
    );

    app.post(
      "/bookings",
      async (req, res) => {
        const booking = req.body;

        const result =
          await bookingsCollection.insertOne(
            booking
          );

        res.send(result);
      }
    );

    app.get(
  "/bookings",
      async (req, res) => {
        const result =
          await bookingsCollection
            .find()
            .toArray();

        res.send(result);
      }
    );

    app.get(
      "/bookings/:email",
      verifyToken,
      async (req, res) => {
        const email =
          req.params.email;

        const query = { email };

        const result =
          await bookingsCollection
            .find(query)
            .toArray();

        res.send(result);
      }
    );

    app.delete(
      "/bookings/:id",
      async (req, res) => {
        const id = req.params.id;

        const query = {
          _id: new ObjectId(id),
        };

        const result =
          await bookingsCollection.deleteOne(
            query
          );

        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Doc Appoint Server Running");
});

app.listen(port, () => {
  console.log(
    `Server running on port ${port}`
  );
});