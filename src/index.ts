import './index.css';
import AutoCompletedSearchBox from './components/AutoCompletedSearchBox';

// Setup the search box component
new AutoCompletedSearchBox(document.getElementById('search-box'), (query: string) => {
    alert(`You searched for ${query}`);
});
