/*
    Holds all code to make the search box
    function.
*/

const apiUrl = 'http://localhost:5000';
const getMatchingPhrasesEndpoint = '/api/v1/match/' // + prefix

class SearchBox {

    _inputEl: HTMLInputElement;
    _matchingPhrasesEl: HTMLDivElement;

    constructor() {
        this._inputEl = document.querySelector('.search__input');
        this._matchingPhrasesEl = document.querySelector('.search__matching_phrases');

        this._inputEl.focus();

        // Event listeners
        this._inputEl.addEventListener('input', this.handleInputEvent);
    }

    handleInputEvent = async (e: any) => {
        const value = e.target.value;

        if (value.length > 0) {
            const response = await fetch(apiUrl + getMatchingPhrasesEndpoint + value);
            const phrases = await response.json();

            if (phrases.length > 0) {
                this.displayMatchingPhrases(phrases.slice(0, 6));
            } else {
                this._matchingPhrasesEl.innerHTML = "";
                this.hideAutoCompleteElements();
            }
        } else {
            this._matchingPhrasesEl.innerHTML = "";
            this.hideAutoCompleteElements();
        }
    }

    displayMatchingPhrases = (phrases: [string]) => {
        // Remove current results
        this._matchingPhrasesEl.innerHTML = "";
    
        this.showAutoCompleteElements();
    
        phrases.forEach((phrase: string) => {
            let el = document.createElement('div');
            el.classList.add('search__matching_phrases_item');
            el.textContent = phrase;
    
            this._matchingPhrasesEl.append(el);
        });
    }
    
    showAutoCompleteElements = () => {
        this._inputEl.classList.add('search__input--autocompleted');
    
        this._matchingPhrasesEl.classList.add('search__matching_phrases--show');
        this._matchingPhrasesEl.classList.add('search__matching_phrases--autocompleted');
    }
    
    hideAutoCompleteElements = () => {
        this._inputEl.classList.remove('search__input--autocompleted');
    
        this._matchingPhrasesEl.classList.remove('search__matching_phrases--show');
        this._matchingPhrasesEl.classList.remove('search__matching_phrases--autocompleted');
    }

}


export default SearchBox;