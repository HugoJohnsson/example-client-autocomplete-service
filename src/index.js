import './index.css';

const apiUrl = 'http://localhost:5000';
const getMatchingPhrasesEndpoint = '/api/v1/match/' // + prefix

// Elements
const searchInput = document.querySelector('.search__input');
const matchingPhrases = document.querySelector('.search__matching_phrases');

// Event listeners
searchInput.addEventListener('input', async (e) => {
    toggleAutoCompleteElements();

    const value = e.target.value;

    if (value.length > 1) {
        const response = await fetch(apiUrl + getMatchingPhrasesEndpoint + value);
        const data = await response.json();

        console.log(data);
    }
});

// Functions
const toggleAutoCompleteElements = () => {
    searchInput.classList.toggle('search__input--autocompleted');

    matchingPhrases.classList.toggle('search__matching_phrases--show');
    matchingPhrases.classList.toggle('search__matching_phrases--autocompleted');
}