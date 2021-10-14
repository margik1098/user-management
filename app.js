const userForm = document.querySelector('#user-form');
const userContainer = document.querySelector('#user-container');
let listItems = [];

function handleFormSubmit(e) {
    e.preventDefault();
    const fName = DOMPurify.sanitize(userForm.querySelector('#fname').value);
    const lName = DOMPurify.sanitize(userForm.querySelector('#lname').value);
    const Email = DOMPurify.sanitize(userForm.querySelector('#email').value);
    const Contact = DOMPurify.sanitize(userForm.querySelector('#contact').value);
    const Gender = DOMPurify.sanitize(userForm.querySelector('input[name="gender"]:checked').value);
    const note = DOMPurify.sanitize(userForm.querySelector('#note').value);
    const newUser = {
        fName, lName, Email, Contact, Gender, note, id: Date.now(),
    }
    listItems.push(newUser);
    e.target.reset();
    userContainer.dispatchEvent(new CustomEvent('refreshUser'));
}

function displayUser() {
    const tempString = listItems.map(item => `
    <div class="col">
      <div class="card mb-4 rounded-3 shadow-sm border-primary">
        <div class="card-header py-3 text-white bg-primary border-primary">
          <h4 class="my-0">${item.id}</h4>
        </div>
        <div class="card-body">
          <ul class="text-start">
            <li><strong>First Name: </strong>${item.fName}</li>
            <li><strong>Last Name: </strong>${item.lName}</li>
            <li><strong>Email: </strong>${item.Email}</li>
            <li><strong>Contact: </strong>${item.Contact}</li>
            <li><strong>Gender: </strong>${item.Gender}</li>
            ${!item.note.length ? "" : `<li><strong>Note: </strong>${item.note}</li>`}
          </ul>
          <button class="btn btn-lg btn-outline-danger" aria-label="Delete" value="${item.id}">Delete</button>
        </div>
      </div>
    </div>
    `).join('');
    userContainer.innerHTML = tempString;
}

function mirrorStateToLocalStorage() {
    localStorage.setItem('userContainer.list', JSON.stringify(listItems));
}

function loadinitialUI() {
    const tempLocalStorage = localStorage.getItem('userContainer.list');
    if (tempLocalStorage === null || tempLocalStorage === []) return;
    const tempUsers = JSON.parse(tempLocalStorage);
    listItems.push(...tempUsers);
    userContainer.dispatchEvent(new CustomEvent('refreshUser'));
}

function deleteUserFromList(id) {
    listItems = listItems.filter(item => item.id !== id);
    userContainer.dispatchEvent(new CustomEvent('refreshUser'));
}

userForm.addEventListener('submit', handleFormSubmit);
userContainer.addEventListener('refreshUser', displayUser);
userContainer.addEventListener('refreshUser', mirrorStateToLocalStorage);
window.addEventListener('DOMContentLoaded', loadinitialUI);
userContainer.addEventListener('click', (e) => {
    if (e.target.matches('.btn-outline-danger')) {
        deleteUserFromList(Number(e.target.value));
    };
})





