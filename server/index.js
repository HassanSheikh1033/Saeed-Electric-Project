require('dotenv').config();
const { MongoClient } = require('mongodb');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const productRoutes = require('./routes/productRoutes')
const receiptRoutes = require('./routes/receiptRoutes')

const app = express()


// MiddleWares:
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {

    console.log(req.path, req.method, req.body)
    next()
})

//Using routes
app.use('/api/products', productRoutes)
app.use('/api/receipt', receiptRoutes)



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() =>
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
    .catch(err => console.log(err));




// async function checkMongoDBStatus() {
//   try {
//     // Replace 'your_mongodb_uri' with your actual MongoDB URI
//     const uri = "mongodb://localhost:27017/";
//     const client = new MongoClient(uri);

//     await client.connect();
//     console.log("MongoDB is running.");
//     await client.close(); // Close the connection after checking
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// checkMongoDBStatus().then(() => {
//     console.log("Script completed.");
// });


