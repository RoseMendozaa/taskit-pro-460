let { MongoClient } = require("mongodb")

let uri = process.env.MONGODB_URI || "mongodb://localhost:27017/"
let client = new MongoClient(uri)

let express = require("express")
let path = require("path")

let app = express()
let port = process.env.PORT || 7777

app.use(express.static("www"))
app.use(express.json())

app.listen(port, function() {
    console.log(`TaskIT server running on port ${port}`)
})

// TEST ROUTE
app.get("/helloworld", function (req, res){
    res.send("TaskIT is running.")
})

// RETRIEVE ALL
app.get("/retrieve", function (req, res) {
    async function run() {
        try {
            await client.connect()

            let database = client.db("app")
            let table = database.collection("tasks")

            let query = {}

            let rows = await table.find(query)

            res.send(JSON.stringify(await rows.toArray()))

        } finally {
            await client.close()
        }
    }

    run()
})

// RETRIEVE ONE
app.get("/retrieve-one/:taskid", function(req, res) {

    async function run() {

        try {

            await client.connect()

            let database = client.db("app")
            let table = database.collection("tasks")

            let query = {
                taskid: parseInt(req.params.taskid)
            }

            let row = await table.findOne(query)

            res.send(JSON.stringify(row))

        } finally {

            await client.close()

        }

    }

    run()

})

// CREATE
app.post("/create", function (req, res) {

    async function run() {

        try {

            await client.connect()

            let database = client.db("app")
            let table = database.collection("tasks")

            let record = {
                taskid: parseInt(req.body.taskid),
                taskname: req.body.taskname,
                taskpriority: req.body.taskpriority,
                taskdate: req.body.taskdate,
                taskcategory: req.body.taskcategory,
                taskdetails: req.body.taskdetails,
                taskstatus: req.body.taskstatus
            }

            let result = await table.insertOne(record)

            res.send("Task created")

        } finally {

            await client.close()

        }

    }

    run()

})

// DELETE
app.delete("/delete/:taskid", function(req, res) {

    async function run() {

        try {

            await client.connect()

            let database = client.db("app")
            let table = database.collection("tasks")

            let query = {
                taskid: parseInt(req.params.taskid)
            }

            let result = await table.deleteOne(query)

            res.send("deleted")

        } finally {

            await client.close()

        }

    }

    run()

})

// UPDATE
app.put("/update", function(req, res) {

    async function run() {

        try {

            await client.connect()

            let database = client.db("app")
            let table = database.collection("tasks")

            let where = {
                taskid: parseInt(req.body.taskid)
            }

            let changes = {
                $set: {
                    taskname: req.body.taskname,
                    taskpriority: req.body.taskpriority,
                    taskdate: req.body.taskdate,
                    taskcategory: req.body.taskcategory,
                    taskdetails: req.body.taskdetails,
                    taskstatus: req.body.taskstatus
                }
            }
            let result = await table.updateOne(where, changes)
            res.send("updated")
        } finally {
            await client.close()
        }
    }
    run()
})
