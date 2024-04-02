(async function() {
    const data = await getData();
    const container = document.querySelector('.user');
    updateUserData(container, data);

    loadSavedUsers();
})();

document.getElementById('get-user-button').addEventListener('click', newUser);
document.getElementById('save-users-button').addEventListener('click', saveAllUsers);

async function newUser() {
    const data = await getData();
    const container = document.createElement('div');
    container.classList.add('user');
    updateUserData(container, data);
    document.getElementById('save-users-button').after(container);
}

function updateUserData(container, data) {

    const headerEl = document.createElement('h2', );
    headerEl.classList.add('name');
    headerEl.textContent = `${data.name?.first} ${data.name?.last}`;
    const imgEl = document.createElement('img');
    imgEl.classList.add('photo');
    imgEl.src = data.picture['large'];
    const emailEl = document.createElement('p');
    emailEl.classList.add('email');
    emailEl.textContent = `Email: ${data.email}`;
    const passwordEl = document.createElement('p');
    passwordEl.classList.add('password');
    passwordEl.textContent = `Password: ${data.login?.password}`;
    const genderEl = document.createElement('p');
    genderEl.classList.add('gender');
    genderEl.textContent = `Gender: ${data.gender}`;
    const phoneEl = document.createElement('p');
    phoneEl.classList.add('phone');
    phoneEl.textContent = `Phone: ${data.phone}`;
    const locationEl = document.createElement('p');
    locationEl.classList.add('location');
    locationEl.textContent = `Location: ${data.location?.city} ${data.location?.country}`;
    const birthdayEl = document.createElement('p');
    birthdayEl.classList.add('birthday');
    birthdayEl.textContent = `Birthday: ${new Date(data.dob?.date).toLocaleDateString('es')}`;

    container.append(imgEl, headerEl, emailEl, passwordEl, genderEl, phoneEl, locationEl, birthdayEl);
}

function saveAllUsers() {
    const users = document.querySelectorAll('.user');
    const usersArr = [];

    for (let item of users) {
        item.classList.remove('user');
        usersArr.push(item.outerHTML);
    }
    localStorage.setItem('users', JSON.stringify(usersArr));
    location.reload();
}


async function getData() {
    try {
        const { results } = await(await fetch('https://randomuser.me/api/')).json();
        return results[0];
    } catch (err) {
        console.error(err);
    }
}

function loadSavedUsers() {
    const savedUsers = JSON.parse(localStorage.getItem('users'));
    const header = document.querySelector('h3');

    if (!savedUsers) {
        header.style.display = 'none';
        return;
    }

    for (let item of savedUsers) {
        const container = document.createElement('div');
        container.setHTML(item);
        container.firstChild.classList.add('saved');
        header.after(container.firstChild);
    }
}



