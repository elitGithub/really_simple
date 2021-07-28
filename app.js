const API_ALL = 'https://restcountries.eu/rest/v2/all';
const nameSearchInput = document.querySelector('.search-name');


document.addEventListener('DOMContentLoaded', async () => {
    let stored = JSON.parse(localStorage.getItem('countries')) ?? [];
    if (stored.length < 1) {
        nameSearchInput.setAttribute('disabled', 'disabled');
        await getAll();
        stored = JSON.parse(localStorage.getItem('countries'));
        nameSearchInput.removeAttribute('disabled');
    }
    renderTable(stored);


    const func = (searchVal) => {
        let stored = JSON.parse(localStorage.getItem('countries'));

        let searchResult = stored.filter(country => {
            return country.name.toLowerCase().includes(searchVal.toLowerCase())
        });
        renderTable(searchResult);
    };

    const search = debounce(func, 400);

    nameSearchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 2) {
            search(e.target.value);
        } else {
            if (e.target.value.length < 1) {
                renderTable(JSON.parse(localStorage.getItem('countries')));
            }
        }
    });
});


async function getAll() {
    const response = await fetch(API_ALL);
    const countries = await response.json();
    // waits until the request completes...
    localStorage.setItem('countries', JSON.stringify(countries));
}

function renderTable(stored) {
    const table = document.querySelector('.data');
    table.innerHTML = '';
    stored.map(country => {
        let domains = '';
        let currencies = '';
        let flag = '';
        let borders = '';
        if (country.hasOwnProperty('topLevelDomain')) {
            domains = country.topLevelDomain.join(', ');
        }

        if (country.hasOwnProperty('currencies')) {
            currencies = country.currencies.map(currency => currency.code).join(', ');
        }

        if (country.hasOwnProperty('flag')) {
            flag = country.flag;
        }

        if (country.hasOwnProperty('borders')) {
            borders = country.borders.join(', ');
            table.innerHTML += `<tr>
                            <td><img class="thumbnail small-flag" src="${flag}" alt=""></td>
                            <td>${country.name}</td>
                            <td>${domains}</td>
                            <td>${country.capital}</td>
                            <td>${currencies}</td>
                            <td>${borders}</td>
                            </tr>`
        }
    });
}

const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

