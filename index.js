const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment");
const bodyparser = require("body-parser");
const post = require("./models/posts");
const register = require("./models/user");
const jwt = require('jsonwebtoken');
const secret = "RESTAPIAUTH";
const port = 3000;


const app = express();

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());

mongoose.connection.once('open', () => {
    console.log('connection established')
}).on('connectionError', (err) => {
    console.log(err);
})


//-----------------------CODE--------------------------------


let data = [];
app.post("/register", async (req, res) => {
    try {
        let details = data.push(register.insertMany({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }));
        res.status(200).json({
            status: "success",
            details
        })
    } catch (err) {
        console.log(err.message);
        res.json({
            message: err.message,
            status: "Failure"
        })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let login = await register.find({ email, password });
        if (!login) {
            return res.status(409).json({
                status: "Failure",
                message: "There is no account with this email"
            })
        }
        //if user already there compare the password
        if (login) {
            // Create a token after login 
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: login._id
            }, secret);


            return res.status(200).json({
                status: "Success",
                message: "Login Succesful",
                token
            })
        } else {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid credentials"
            })
        }

    } catch (err) {
        res.json({
            status: "Failed",
            message: err.message
        })
    }
})

let detail = [];
app.post("/posts", async (req, res) => {
    try {
        let posts = detail.push(post.insertMany({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image
        }));

        res.status(200).json({
            status: "success",
            posts
        })
    }
    catch (err) {
        console.log(err.message);
        res.json({
            message: err.message,
            status: "Failure"
        })
    }
})

app.get("/posts", async (req, res) => {
    try {
        const posts = await post.find();
        res.status(200).json({
            status: "success",
            posts: posts
        })
    }
    catch (err) {
        res.status(400).json({
            status: "Failure",
            message: err.message
        })
    }
})

app.put("/posts/:postId", async (req, res) => {
    try {
        const posts = await post.updateOne({ _id: req.params.id }, req.body);
        res.json({
            status: "success",
            posts
        })
    }
    catch (err) {
        res.status(404).json({
            status: "Could Not able to Update",
            message: err.message
        })
    }
})

app.delete("/posts/:postId", async (req, res) => {
    try {
        const posts = await post.deleteOne({ _id: req.params.id });
        res.status(200).json({
            status: "success",
            posts
        })
    }
    catch (err) {
        res.status(404).json({
            status: "Not Deleted",
            message: err.message
        })
    }
})

app.get("*", (req, res) => {
    res.status(404).send("API NOT FOUND")
})

app.listen(port, () => { console.log(`server is up at ${port}`) });