const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

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

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});