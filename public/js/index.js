import { login, logout } from './login';
import { showAlert } from './showAlert';
import { booking } from './stripe';
import { updateProfile, updateSettings } from './updateSetting';

let logoutel = document.getElementsByClassName('nav__el--logout')[0];
if (logoutel) {
  logoutel.addEventListener('click', () => {
    logout();
  });
}

let form = document.querySelector('.form--login');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    login(email, password);
  });
}

const updateForm = document.querySelector('.form-user-data');

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];

  
    let form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'profile');
  });
}

const passwordFormbtn = document.querySelector('.update-pass-btn');

if (passwordFormbtn) {
  passwordFormbtn.addEventListener('click', async (e) => {
    passwordFormbtn.textContent = 'Updating...';
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('newPassword').value;
    const newConfirmPassword =
      document.getElementById('newConfirmPassword').value;

    await updateSettings(
      { password, newPassword, newConfirmPassword },
      'password'
    );
    document.getElementById('password-current').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newConfirmPassword').value = '';
    passwordFormbtn.textContent = 'Save password';
  });
}

const bookbnt = document.getElementById('book-tour');
if (bookbnt) {
  const tourId = bookbnt.dataset.tourId;
  bookbnt.addEventListener('click', (e) => {
    booking(tourId);
  });
}


const alertMessage = document.querySelector("body").dataset.alert

if(alertMessage !== null){
  showAlert("success",alertMessage,20)
}