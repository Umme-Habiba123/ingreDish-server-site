const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());


require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbcozto.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("ingridish-db");
    const ingridishCollections = db.collection("ingridish");
    const galleryCollection=db.collection("galleryImage")

    // Get all products
    app.get("/api/products", async (req, res) => {
      const products = await ingridishCollections.find().toArray();
      res.send(products);
    });

    // Get single product by ID
    app.get("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await ingridishCollections.findOne({
        _id: new ObjectId(id),
      });
      res.send(product);
    });

    // Add new product
    app.post("/api/products", async (req, res) => {
      const product = req.body;
      const result = await ingridishCollections.insertOne(product);
      res.send(result);
    });

    // Delete product
    app.delete("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ingridishCollections.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //feature section
    app.get("/api/feature", async (req, res) => {
      const feature = await ingridishCollections
        .find()
        .sort({ createdAt: "desc" })
        .limit(6)
        .toArray();
      res.send(feature);
    });

    //manageProducts
    app.get("/api/manageProducts", async (req, res) => {
      const email = req.query.email;
      const result = await ingridishCollections
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // get all gallery image-----
     app.get("/api/gallery", async (req, res) => {
      const products = await galleryCollection.find().toArray();
      res.send(products);
    });

// add gallery images----
app.post("api/gallery", async(res,req)=>{
  const newItem = req.body
  const result=await galleryCollection.insertOne(newItem)
  res.send(result)
})




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});