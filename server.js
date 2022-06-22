const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
//parse incoming json data
app.use(express.json());
const { animals } = require('./data/animals');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if(query.personalityTraits) {
        //save personality traits as a dedicated array
        //if only one personality trait, it will return it as a string
        //store single trait in specified array
        //if multiple are selected, an array will return with the selected traits as shown in the else statement
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    }
    //loop through traits array
    personalityTraitsArray.forEach(trait => {
        //check the selected trait/s against each animal
        //update animals array for each trait in the loop
        //the new aray will contain only the animals that have the selected traits
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    //main code
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray}, null, 2)
    );
    //return finished code to post route
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404)
    }
});
app.post('/api/animals', (req, res) => {
    //set animal id based on the next index of the animals array
    req.body.id = animals.length.toString();
    
    //if any data is invalid, send 400 error
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    //otherwise add animal to json file and animals array
    else {
        const animal = createNewAnimal(req.body, animals);
        res.json(req.body);
    }
});
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});