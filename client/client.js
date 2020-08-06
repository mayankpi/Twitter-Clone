
console.log('Hello World!');
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const twootsElement = document.querySelector('.twoots');
loadingElement.style.display = 'none';
const API_URL = 'http://localhost:5000/twoots'; 

listAllTwoots();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    
    const twoot = {
        name,
        content
    };
    //console.log(twoot);
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(twoot),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdTwoot => {
            //console.log(createdTwoot);
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 10000);
            listAllTwoots();
            loadingElement.style.display = 'none';
        });
});

function listAllTwoots() {
    twootsElement.innerHTML = ''; // clear page each time it refreshes and adding new elements
    fetch(API_URL)
    .then(response => response.json())
    .then(twoots => {
        console.log(twoots);
        twoots.reverse();
        twoots.forEach(twoot => {
            const div = document.createElement('div');
            const header = document.createElement('h3');
            header.textContent = twoot.name;
            const contents = document.createElement('p');
            contents.textContent = twoot.content;

            const date = document.createElement('p');
            date.textContent = new Date(twoot.created);
            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            twootsElement.appendChild(div);
        });
    });
}