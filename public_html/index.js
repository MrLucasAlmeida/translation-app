// Author: Lucas Almeida
// script for making changes to index.html

function displayText() {

    // firstToSecond is a boolean that determines if the 
    // translation is from the first language to the second or vice versa

    // grabs elements
    const originalTextElement = document.getElementById('firstBox');
    const translateToElement = document.getElementById('secondBox');
    const translationType = `${firstLanguage}2${secondLanguage}`;

    // splits the phrase into words and joins them with a + sign
    const phrase = originalTextElement.value.split(' ').join('+');

    // checks if the phrase is empty
    if (phrase === '' || phrase === ' ') {
        originalTextElement.innerText = '';
        translateToElement.innerText = '';
        return;
    }

    // ajax request
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === request.DONE && request.status === 200) {
            translateToElement.innerText = request.responseText;
        } else {
            translateToElement.innerText = 'Error';
        }
    }
    request.open('GET', `/translate/${translationType}/${phrase}`, true);
    request.send();

    
}

function updateLanguageVars() {
    // grabs elements
    const firstLanguageElement = document.getElementById('languageOriginal');
    const secondLanguageElement = document.getElementById('languageTranslation');

    // updates the variables for the languages
    firstLanguage = firstLanguageElement.value[0].toLowerCase();
    secondLanguage = secondLanguageElement.value[0].toLowerCase();
}



// current language config
let firstLanguage = 'e';
let secondLanguage = 'e';
