import { showAlert, hideAlert } from './showAlert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Log in successfully');
      window.setTimeout(() => {
        hideAlert();
        location.assign('/');
      }, 3000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/logout',
    });

    location.assign('/');
    location.reload(true);
  } catch (error) {
    showAlert('error', 'something went wrong');
  }
};
