import './index.css';

const apiUrl = 'http://localhost:5000';
const getMatchingPhrasesEndpoint = '/api/v1/match/' // + prefix

let isAutoCompleteElementsDisplayed = false;

// Elements
const searchInput = document.querySelector('.search__input');
const matchingPhrases = document.querySelector('.search__matching_phrases');

searchInput.focus();

// Event listeners
searchInput.addEventListener('input', async (e) => {
    const value = e.target.value;

    if (value.length > 0) {
        const response = await fetch(apiUrl + getMatchingPhrasesEndpoint + value);
        const phrases = await response.json();

        if (phrases.length > 0) {
            displayMatchingPhrases(phrases.slice(0, 6));
        } else {
            matchingPhrases.innerHTML = "";
            hideAutoCompleteElements();
        }
    } else {
        matchingPhrases.innerHTML = "";
        hideAutoCompleteElements();
    }
});

// Functions
const displayMatchingPhrases = (phrases) => {
    // Remove current results
    matchingPhrases.innerHTML = "";

    showAutoCompleteElements();

    phrases.forEach(phrase => {
        let el = document.createElement('div');
        el.classList.add('search__matching_phrases_item');
        el.textContent = phrase;

        matchingPhrases.append(el);
    });
}

const showAutoCompleteElements = () => {
    isAutoCompleteElementsDisplayed = true;
    searchInput.classList.add('search__input--autocompleted');

    matchingPhrases.classList.add('search__matching_phrases--show');
    matchingPhrases.classList.add('search__matching_phrases--autocompleted');
}

const hideAutoCompleteElements = () => {
    isAutoCompleteElementsDisplayed = false;
    searchInput.classList.remove('search__input--autocompleted');

    matchingPhrases.classList.remove('search__matching_phrases--show');
    matchingPhrases.classList.remove('search__matching_phrases--autocompleted');
}