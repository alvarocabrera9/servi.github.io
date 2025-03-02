// Funciones para alternar entre pestañas
function showTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginTab = document.querySelector('.auth-tabs button:nth-child(1)');
  const registerTab = document.querySelector('.auth-tabs button:nth-child(2)');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
  }
}

// Función para manejar el registro
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const messageElement = document.getElementById('register-message');

  // Verificar si el usuario ya existe
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    messageElement.textContent = 'Este correo ya está registrado. Por favor, inicia sesión.';
    messageElement.classList.remove('success');
    messageElement.classList.add('error');
    return;
  }

  // Guardar el nuevo usuario en localStorage
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Mostrar mensaje de éxito
  messageElement.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
  messageElement.classList.remove('error');
  messageElement.classList.add('success');

  // Limpiar el formulario
  document.getElementById('registerForm').reset();

  // Cambiar a la pestaña de inicio de sesión
  showTab('login');
}

// Función para manejar el inicio de sesión
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const messageElement = document.getElementById('login-message');

  // Obtener los usuarios de localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    // Borrar completamente el caché de la cuenta anterior
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('serviceHistory');
    localStorage.removeItem('favorites');
    localStorage.removeItem('professionalReviews');

    // Guardar el estado de autenticación de la nueva cuenta
    localStorage.setItem('authenticatedUser', JSON.stringify(user));

    // Mostrar mensaje de éxito
    messageElement.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
    messageElement.classList.remove('error');
    messageElement.classList.add('success');

    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    messageElement.textContent = 'Correo o contraseña incorrectos. Intenta de nuevo.';
    messageElement.classList.remove('success');
    messageElement.classList.add('error');
  }
}

// Función para redirigir a la página principal
function goToHome() {
  window.location.href = 'index.html';
}

// Cargar estado de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el usuario está autenticado
  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  if (authenticatedUser) {
    document.getElementById('auth-link').innerHTML = `Hola, ${authenticatedUser.name}`;
    document.getElementById('auth-link').href = '#';
    document.getElementById('auth-link').onclick = () => window.location.href = 'profile.html';
    document.getElementById('profile-link').style.display = 'inline-block';
  } else {
    document.getElementById('profile-link').style.display = 'none';
  }
});