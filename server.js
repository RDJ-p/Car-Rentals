import express from 'express'
import { MongoClient } from "mongodb";

const app= express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get('/', (req, res) => {
    res.render("landingPage.ejs")
})
app.get("/login", (req, res) => {
    res.render("login.ejs")
})
app.get("/register", (req, res) => {
    res.render("register.ejs")
})
app.post("/register",async(req,res)=>{
    try{
    const {firstName,lastName,email,phone,password}=req.body
    const userCollection=req.app.locals.usersCollection
        await userCollection.insertOne({
            firstName,
            lastName,
            email,
            phone,
            password
        })
        res.redirect("/")
    }catch(error){
        console.error("Failed to save user:", error);
        res.status(500).send("Something went wrong while saving your user.");
    }
});
app.post("/rental-form", async (req, res) => {
    try {
        const { carType, rentalPlace, rentalDate, rentalTime } = req.body;

        await req.app.locals.rentalCollection.insertOne({
            carType,
            rentalPlace,
            rentalDate,
            rentalTime,
            createdAt: new Date() 
        });

        res.redirect("/");
        
    } catch (err) {
        console.error("Failed to save rental:", err);
        res.status(500).send("Something went wrong while saving your rental.");
    }
});
const url = "mongodb://127.0.0.1:27017";
const dbName = "carRentals";

async function startServer() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const db = client.db(dbName);
    app.locals.usersCollection = db.collection("users");
    app.locals.carCollection = db.collection("car");
    app.locals.rentalCollection=db.collection("rental-form")
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

startServer();