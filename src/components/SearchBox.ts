/*
    Holds all code to make the search box
    function.
*/

const getMatchingPhrasesUrl = (prefix: string) => 'http://localhost:5000/api/v1/match/' + prefix;

type OnSubmitFunction = (query: string) => any;

class SearchBox {

    _el: HTMLElement; // The root search box element
    _inputEl: HTMLInputElement;
    _matchingPhrasesEl: HTMLElement;

    _matchingPhrases: Array<string>; // Holds all current matching phrases
    _selectedPhraseIndex = 0; // Holds the index of the matching phrase currently selected in this._matchingPhrases
    /*
        Has the user start to look through the matching phrases with the arrow keys?
        Is used to determine the index of the the phrase element to "focus" on
    */
    _haveUserPressedArrows = false;
    
    _onSubmit: OnSubmitFunction; // This function is called when the presses the enter button, is passed in via the constructor

    constructor(el: HTMLElement, onSubmit: OnSubmitFunction) {
        this._el = el;
        this._onSubmit = onSubmit;

        this._inputEl = el.querySelector('#search-input');
        if (!this._inputEl) throw Error(`Couldn't find an element with the id: search-input, this must exists for the search box to function.`);

        this._matchingPhrasesEl = el.querySelector('#matching-phrases');
        if (!this._inputEl) throw Error(`Couldn't find an element with the id: matching-phrases, this must exists for the search box to function.`);

        this._inputEl.focus();

        // Event listeners
        this._el.addEventListener('mouseout', () => {
            this.resetSelectedPhrase();
        });

        this._inputEl.addEventListener('input', this.handleSearchInputEvent);
        document.onkeydown = (e) => {
            if (e.key == 'ArrowUp') {
                this.updateSelectedPhraseIndex('decrement');
                this.setSelectedMatchingPhrase(this._matchingPhrases[this._selectedPhraseIndex]);
            }
            else if (e.key == 'ArrowDown') {
                if (this._haveUserPressedArrows) {
                    this.updateSelectedPhraseIndex('increment');
                } else {
                    this._haveUserPressedArrows = true;
                }
                
                this.setSelectedMatchingPhrase(this._matchingPhrases[this._selectedPhraseIndex]);
            }
            else if(e.key == 'Enter') {
                if (this._haveUserPressedArrows) { // Search for the currently selected phrase
                    this.submit(this._matchingPhrases[this._selectedPhraseIndex]);
                } else {
                    this.submit();
                }
            }
        }
    }

    submit = (value?: string) => {
        if (value) this._onSubmit(value);
        else this._onSubmit(this._inputEl.value);

        this.reset();
    }

    updateSelectedPhraseIndex = (action: 'increment' | 'decrement') => {
        switch (action) {
            case 'increment':
                this._selectedPhraseIndex += 1;

                if (this._selectedPhraseIndex > this._matchingPhrases.length - 1) {
                    this._selectedPhraseIndex = this._matchingPhrases.length - 1;
                }
                break;
            case 'decrement':
                this._selectedPhraseIndex -= 1;

                if (this._selectedPhraseIndex < 0) {
                    this._selectedPhraseIndex = 0;
                }
                break;
        }
    }

    handleSearchInputEvent = async (e: any) => {
        this.resetSelectedPhrase(); // Reset the selected phrase everytime something new is typed in to the input field
        const searchInputValue = e.target.value;

        if (searchInputValue.length > 0) {
            let phrases = await fetch(getMatchingPhrasesUrl(searchInputValue)).then(response => response.json());
            phrases = phrases.slice(0, 6);

            this._matchingPhrases = phrases;

            if (phrases.length > 0) {
                this.displayMatchingPhrases(phrases);
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
            const el = this.makeMatchingPhraseElement(phrase);
    
            this._matchingPhrasesEl.append(el);
        });
    }

    makeMatchingPhraseElement = (phrase: string) => {
        let el = document.createElement('div');
        el.classList.add('search__matching_phrases_item');
        el.textContent = phrase;

        el.addEventListener('mouseover', (e: any) => {
            this._selectedPhraseIndex = this._matchingPhrases.indexOf(phrase);
            this.setSelectedMatchingPhrase(e.target.textContent);
        });

        el.addEventListener('click', (e: any) => {
            this.submit(e.target.textContent);
        });

        return el;
    }

    setSelectedMatchingPhrase = (phrase: string) => {
        this.getAllMatchingPhrasesElements().forEach((phraseEl: HTMLElement) => {
            if (phraseEl.textContent == phrase) {
                phraseEl.style.background = '#f1f1f1';
            } else {
                phraseEl.style.background = '';
            }
        });
    }
    
    resetSelectedPhrase = () => {
        this._haveUserPressedArrows = false;
        this._selectedPhraseIndex = 0;

        this.getAllMatchingPhrasesElements().forEach((phraseEl: HTMLElement) => {
            phraseEl.style.background = '';
        });
    }

    getAllMatchingPhrasesElements = () => {
        return document.querySelectorAll('.search__matching_phrases_item');
    }
    
    showAutoCompleteElements = () => {
        this._inputEl.classList.add('search__input--autocompleted');
        this._matchingPhrasesEl.classList.add('search__matching_phrases--show', 'search__matching_phrases--autocompleted');
    }
    
    hideAutoCompleteElements = () => {
        this._inputEl.classList.remove('search__input--autocompleted');
        this._matchingPhrasesEl.classList.remove('search__matching_phrases--show', 'search__matching_phrases--autocompleted');
    }

    reset = () => {
        this._inputEl.value = "";
        this.resetSelectedPhrase();
        this.hideAutoCompleteElements();
        this._matchingPhrases = [];
    }

}


export default SearchBox;