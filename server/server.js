const Express = require("express");
const Cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

var app = Express();
app.use(Cors());
app.use(Express.json());

const CONNECTION_STRING = "mongodb+srv://admin:<YOUR_PASSWORD>";

const client = new MongoClient(CONNECTION_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

app.listen(5038, () => {
    client.connect();
    client.db('movieappusersdb').command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
})

app.post("/registerUser", async (request, response) => { 
    response.setHeader('Content-Type', 'application/json');

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');
    const count = await movieAppCollection.countDocuments();

    const doc = {
        id: count + 1,
        name: request.body.username,
        password: request.body.password,
        movieLists: [{list_id: new ObjectId(), list_name: "Admins Suggestions", list_movies: ["tt0078346", "tt0348150", "tt0954968"]}]
    };

    const existingUser = await movieAppCollection.findOne({name: doc.name});
    console.log(doc.id);
    console.log(existingUser);
    console.log(existingUser == null);

    if(existingUser != null) {
        response.json({ success: false, message: 'Username already exists' });
    }
    else {
        const result = await movieAppCollection.insertOne(doc);
        response.json({ success: true, message: 'User registered successfully' });
        console.log('document inserted');
    } 
});

app.post('/loginUser', async (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const query = { name: request.body.username, password: request.body.password};

    const user = await movieAppCollection.findOne(query);
    if(user == null) {
        response.json({success: false, message: "Username or password incorrect"});
    } else {
        response.json({success: true, message: `Login successfull`, user})
    }
});

app.post('/createList', async (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const currentMovieList = {list_id: new ObjectId(), list_name: request.body.list_name, list_movies: request.body.list_movies};

    const result = await movieAppCollection.updateOne(
        { id: request.body.id},
        { $push: {movieLists: currentMovieList}}
    );

    console.log(`${result.modifiedCount} kullanıcı güncellendi.`);
    console.log('Yeni film eklendi:', currentMovieList);
});

app.delete('/deleteMovieList/:user_id/:list_id', async (request, response) => {
    const userID = parseInt(request.params.user_id);
    const listID = request.params.list_id;

    console.log(typeof(userID));
    console.log(typeof(listID));
    console.log(listID);

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const user = await movieAppCollection.findOne({id: userID});

    const currentListIndex = user.movieLists.findIndex(curr => curr.list_id == listID);
    console.log(currentListIndex);
    console.log(typeof(user.movieLists[currentListIndex].list_id));

    //const current_list = user.movieLists.filter(curr => curr.list_id == listID);
    //console.log(current_list);
    //console.log(typeof(current_list.list_id));
    //console.log(String(current_list.list_id));
    //console.log(typeof(user.movieLists[5].list_id));

    const result = await movieAppCollection.updateOne(
        { id: userID },
        { $pull: {movieLists: {list_id: user.movieLists[currentListIndex].list_id}}}
    );
});

app.post('/updateList', async (request, response) => {
    response.setHeader("Content-Type", "application/json");

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const doc = {
        userID: parseInt(request.body.userID),
        listID: request.body.listID,
        moviesIdsOfUpdatedList: request.body.moviesIdsOfUpdatedList
    }

    console.log(doc.userID);
    console.log(doc.listID);
    console.log(moviesIdsOfUpdatedList);
    //console.log(currentListIndex);

    /*const user = await movieAppCollection.findOne({id: doc.userID});
    const currentListIndex = user.movieLists.findIndex(curr => curr.list_id == doc.listID);
    console.log(doc.moviesIdsOfUpdatedList);
    

    const filter = {
        id: doc.userID,
        [`movieLists.${currentListIndex}.list_id`]: user.movieLists[currentListIndex].list_id
    }

    const update = { $set: {} };
    update.$set[`movieLists.${currentListIndex}.list_movies`] = moviesIdsOfUpdatedList;

    console.log(filter);
    console.log(update);

    //const result = await movieAppCollection.updateOne(filter, update);*/
});

app.get('/movieLists/:user_id', async (request, response) => {
    const userID = parseInt(request.params.user_id);

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const user = await movieAppCollection.findOne({id: userID});
    const movieLists = user.movieLists;
    response.json(movieLists);
});

app.post('/getMovieLists', async (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    const database = client.db('movieappusersdb');
    const movieAppCollection = database.collection('movieappuserscollection');

    const user = await movieAppCollection.findOne({id: request.body.id});
    response.json(user.movieLists);
});