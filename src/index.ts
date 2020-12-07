import './index.css';
import SearchBox from './components/SearchBox';

// Setup the search box component
new SearchBox(document.getElementById('search-box'), (query: string) => {
    alert(`You searched for ${query}`);
});
