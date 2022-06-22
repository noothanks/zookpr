const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  fetch('/api/animals', {
    //specify type of request
    //connects request to proper endpont in the server
    method: 'POST',
    //sets data type to JSON
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    //adds stringified JSON animal object to the req.body
    body: JSON.stringify(animalObject)
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    alert('Error: ' + response.statusText);
  })
  .then(postRespone => {
    console.log(postRespone);
    alert('Thank you for adding an animal');
  });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
