import express from "express";
import path from "path";
import { MongoClient, ObjectId} from "mongodb";

const app = express();

const publicPath = path.resolve('public'); // Serve static files from the "public" directory
app.use(express.static(publicPath));

app.set("view engine", "ejs");

const dbName = "node-project";
const collectionName = "todo";
const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName);
};

app.use(express.urlencoded({ extended: true }));

app.get('/', async(req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray();
    // console.log(result);
    res.render("list", {result});
});

app.get('/add', (req, res) => {
    res.render("add");
});

app.get('/update', (req, res) => {
    res.render("update");
});

app.post('/add', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);

    
if (result.acknowledged) {
    res.redirect("/");
} else {
    res.send("Error in adding task");
}


});

app.post('/update', (req, res) => {
    res.redirect("/");
});

app.get('/delete/:id', async (req, res) => {

    const db = await connection();

    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount > 0) {
        res.redirect("/");
    } else {
        res.send("Error");
    }

}); 


app.get('/update/:id', async (req, res) => {

    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
    console.log(result);

    if (result) {
        res.render("update", { result });
    } else {
        res.send("Error");
    }

});

app.post('/update/:id', async (req, res) => {

    const db = await connection();
    const collection = db.collection(collectionName);

    const filter = { _id: new ObjectId(req.params.id) };

    const updatedData = {
        $set: {
            title: req.body.title,
            description: req.body.description
        }
    };

    const result = await collection.updateOne(filter, updatedData);
    console.log(result);

    if (result.matchedCount > 0) {
        res.redirect("/");
    } else {
        res.send("Error");
    }

});

app.listen(3200, () => {
    console.log("Server is running on port 3200");
});
