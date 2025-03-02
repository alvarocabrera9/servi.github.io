// Datos simulados de profesionales por categoría
const professionalsData = {
  Fontanero: [
    { name: "Juan Pérez", distance: "2.5 km", rating: 4.8, available: true },
    { name: "María Gómez", distance: "3.1 km", rating: 4.5, available: false },
    { name: "Carlos López", distance: "5.0 km", rating: 4.9, available: true },
  ],
  Electricista: [
    { name: "Ana Martínez", distance: "1.8 km", rating: 4.7, available: true },
    { name: "Pedro Sánchez", distance: "4.2 km", rating: 4.6, available: false },
  ],
  Constructor: [
    { name: "Luis Rodríguez", distance: "3.0 km", rating: 4.9, available: true },
    { name: "Sofía Díaz", distance: "6.5 km", rating: 4.3, available: false },
  ],
  Jardinero: [
    { name: "Elena Vargas", distance: "2.0 km", rating: 4.8, available: true },
    { name: "Miguel Torres", distance: "3.8 km", rating: 4.4, available: true },
  ],
  Carpintero: [
    { name: "José Ramírez", distance: "2.7 km", rating: 4.6, available: false },
    { name: "Laura Fernández", distance: "3.5 km", rating: 4.7, available: true },
  ],
  Pintor: [
    { name: "Laura Fernández", distance: "4.0 km", rating: 4.7, available: true },
    { name: "Diego Salazar", distance: "5.2 km", rating: 4.5, available: false },
  ],
  Cerrajero: [
    { name: "Pablo Ortiz", distance: "3.2 km", rating: 4.5, available: true },
    { name: "Clara Morales", distance: "4.0 km", rating: 4.8, available: false },
    { name: "Andrés Vega", distance: "2.8 km", rating: 4.6, available: true },
  ],
  Limpiador: [
    { name: "Clara Morales", distance: "2.8 km", rating: 4.9, available: true },
    { name: "Sofía Castro", distance: "3.5 km", rating: 4.7, available: false },
    { name: "Manuel Rojas", distance: "4.1 km", rating: 4.4, available: true },
  ],
  "Técnico de Aire Acondicionado": [
    { name: "Diego Salazar", distance: "4.5 km", rating: 4.6, available: false },
    { name: "Ana Torres", distance: "3.0 km", rating: 4.9, available: true },
    { name: "Ricardo Méndez", distance: "5.5 km", rating: 4.3, available: true },
  ],
};

// Elementos del DOM
const categoriesSection = document.getElementById('categories');
const searchResultsSection = document.getElementById('search-results');
const scheduleServiceSection = document.getElementById('schedule-service');
const categoryNameElement = document.getElementById('category-name');
const professionalsListElement = document.getElementById('professionals-list');
const professionalNameElement = document.getElementById('professional-name');
const categoryBoxes = document.querySelectorAll('.category-box');
const serviceDateInput = document.getElementById('service-date');
const serviceTimeInput = document.getElementById('service-time');
const urgentServiceRadio = document.getElementById('urgent');
const customServiceRadio = document.getElementById('custom');
const customSchedule = document.getElementById('custom-schedule');
const authLink = document.getElementById('auth-link');
const profileLink = document.getElementById('profile-link');
const notification = document.getElementById('notification');

// Depuración: Verificar que los elementos existan
console.log("Categories Section:", categoriesSection);
console.log("Search Results Section:", searchResultsSection);
console.log("Schedule Service Section:", scheduleServiceSection);
console.log("Category Name Element:", categoryNameElement);
console.log("Professionals List Element:", professionalsListElement);
console.log("Professional Name Element:", professionalNameElement);
console.log("Category Boxes:", categoryBoxes);

// Asegurarse de que las secciones estén en el estado correcto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  console.log("Página cargada. Asegurando estado inicial...");
  if (categoriesSection && searchResultsSection && scheduleServiceSection) {
    categoriesSection.classList.remove('hidden');
    searchResultsSection.classList.add('hidden');
    scheduleServiceSection.classList.add('hidden');
    
    // Depuración: Verificar estado inicial
    console.log("Estado inicial - Categories Section ClassList:", categoriesSection.classList);
    console.log("Estado inicial - Search Results Section ClassList:", searchResultsSection.classList);
    console.log("Estado inicial - Schedule Service Section ClassList:", scheduleServiceSection.classList);
  } else {
    console.error("No se encontraron las secciones necesarias al cargar la página");
  }

  // Verificar si el usuario está autenticado
  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  if (authenticatedUser) {
    authLink.innerHTML = `Hola, ${authenticatedUser.name}`;
    authLink.href = '#';
    authLink.onclick = () => window.location.href = 'profile.html';
    profileLink.style.display = 'inline-block';
  } else {
    profileLink.style.display = 'none';
  }
});

let selectedCategory = '';
let selectedProfessional = '';

// Función para mostrar los resultados de búsqueda
function showSearchResults(category) {
  console.log("Mostrando resultados para la categoría:", category);
  selectedCategory = category;

  // Mostrar la sección de resultados y ocultar otras
  if (categoriesSection && searchResultsSection && scheduleServiceSection) {
    categoriesSection.classList.add('hidden');
    searchResultsSection.classList.remove('hidden');
    scheduleServiceSection.classList.add('hidden');
    
    // Depuración: Verificar el estado de las clases
    console.log("Categories Section ClassList:", categoriesSection.classList);
    console.log("Search Results Section ClassList:", searchResultsSection.classList);
    console.log("Schedule Service Section ClassList:", scheduleServiceSection.classList);
    
    // Forzar visibilidad por si hay un problema de CSS
    searchResultsSection.style.display = 'block';
  } else {
    console.error("No se encontraron las secciones necesarias");
    return;
  }

  // Actualizar el nombre de la categoría
  if (categoryNameElement) {
    categoryNameElement.textContent = category;
  } else {
    console.error("No se encontró el elemento category-name");
    return;
  }

  // Limpiar la lista de profesionales
  if (professionalsListElement) {
    professionalsListElement.innerHTML = '';
  } else {
    console.error("No se encontró el elemento professionals-list");
    return;
  }

  // Obtener los profesionales de la categoría seleccionada
  const professionals = professionalsData[category] || [];
  console.log("Profesionales encontrados:", professionals);

  if (professionals.length === 0) {
    professionalsListElement.innerHTML = '<p>No hay profesionales disponibles en esta categoría.</p>';
    return;
  }

  // Crear las tarjetas de profesionales
  professionals.forEach(prof => {
    const card = document.createElement('div');
    card.classList.add('professional-card');
    card.innerHTML = `
      <div class="professional-info">
        <h4>${prof.name}</h4>
        <p>Distancia: ${prof.distance}</p>
        <p class="availability ${prof.available ? '' : 'unavailable'}">${prof.available ? 'Disponible Ahora' : 'Ocupado'}</p>
        <div class="rating">
          ${generateStars(prof.rating)} (${prof.rating})
        </div>
      </div>
      <div>
        <button class="request-btn" onclick="selectProfessional('${prof.name}')">Seleccionar</button>
        <button class="favorite-btn" onclick="addToFavorites('${prof.name}', '${category}')">⭐</button>
        <button class="chat-btn" onclick="openChat('${prof.name}')">💬</button>
      </div>
    `;
    professionalsListElement.appendChild(card);
  });

  // Depuración: Verificar que las tarjetas se hayan añadido
  console.log("Contenido de professionals-list:", professionalsListElement.innerHTML);
}

// Función para generar estrellas de valoración
function generateStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<span>★</span>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<span>☆</span>';
    } else {
      stars += '<span>☆</span>';
    }
  }
  return stars;
}

// Función para seleccionar un profesional y mostrar el formulario de programación
function selectProfessional(professionalName) {
  console.log("Profesional seleccionado:", professionalName);
  selectedProfessional = professionalName;

  if (categoriesSection && searchResultsSection && scheduleServiceSection) {
    categoriesSection.classList.add('hidden');
    searchResultsSection.classList.add('hidden');
    scheduleServiceSection.classList.remove('hidden');
    
    // Depuración: Verificar el estado de las clases
    console.log("Categories Section ClassList:", categoriesSection.classList);
    console.log("Search Results Section ClassList:", searchResultsSection.classList);
    console.log("Schedule Service Section ClassList:", scheduleServiceSection.classList);
    
    // Forzar visibilidad
    scheduleServiceSection.style.display = 'block';
  } else {
    console.error("No se encontraron las secciones necesarias");
    return;
  }

  if (professionalNameElement) {
    professionalNameElement.textContent = professionalName;
  } else {
    console.error("No se encontró el elemento professional-name");
    return;
  }

  if (serviceDateInput && serviceTimeInput && urgentServiceRadio && customServiceRadio) {
    urgentServiceRadio.checked = true;
    toggleScheduleType();
  } else {
    console.error("No se encontraron los elementos del formulario");
  }
}

// Función para alternar entre urgente y personalizado
function toggleScheduleType() {
  const isUrgent = urgentServiceRadio.checked;
  if (isUrgent) {
    customSchedule.classList.add('hidden');
    serviceDateInput.disabled = true;
    serviceTimeInput.disabled = true;
    const today = new Date();
    serviceDateInput.value = today.toISOString().split('T')[0];
    serviceTimeInput.value = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
  } else {
    customSchedule.classList.remove('hidden');
    serviceDateInput.disabled = false;
    serviceTimeInput.disabled = false;
    serviceDateInput.value = '';
    serviceTimeInput.value = '';
  }
}

// Función para confirmar el servicio
function confirmService() {
  const isUrgent = urgentServiceRadio.checked;
  const paymentMethod = document.getElementById('payment-method').value;
  let message = '';
  let serviceDetails = {};

  if (isUrgent) {
    message = `Servicio urgente confirmado con ${selectedProfessional} (${selectedCategory}). Un profesional se pondrá en contacto contigo pronto.`;
    serviceDetails = {
      professional: selectedProfessional,
      category: selectedCategory,
      date: serviceDateInput.value,
      time: serviceTimeInput.value,
      urgent: true,
      paymentMethod: paymentMethod,
      completed: false // Estado inicial: no completado
    };
  } else {
    const date = serviceDateInput.value;
    const time = serviceTimeInput.value;

    if (!date || !time) {
      alert('Por favor, selecciona una fecha y hora para el servicio.');
      return;
    }

    message = `Servicio confirmado con ${selectedProfessional} (${selectedCategory}) para el ${date} a las ${time}. Te enviaremos una confirmación pronto.`;
    serviceDetails = {
      professional: selectedProfessional,
      category: selectedCategory,
      date: date,
      time: time,
      urgent: false,
      paymentMethod: paymentMethod,
      completed: false // Estado inicial: no completado
    };
  }

  // Guardar el servicio en el historial
  const history = JSON.parse(localStorage.getItem('serviceHistory')) || [];
  history.push(serviceDetails);
  localStorage.setItem('serviceHistory', JSON.stringify(history));

  // Mostrar notificación de confirmación
  showNotification(message);

  // Simular notificación del profesional
  const estimatedTime = Math.floor(Math.random() * 60) + 15; // Tiempo estimado entre 15 y 75 minutos
  setTimeout(() => {
    showNotification(`${selectedProfessional} ha recibido tu pedido y estará contigo en ${estimatedTime} minutos.`);
  }, 2000); // Mostrar después de 2 segundos

  goToHome();
}

// Función para añadir a favoritos
function addToFavorites(professionalName, category) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favorite = { name: professionalName, category };
  if (!favorites.some(fav => fav.name === professionalName && fav.category === category)) {
    favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showNotification(`${professionalName} ha sido añadido a tus favoritos.`);
  } else {
    showNotification(`${professionalName} ya está en tus favoritos.`);
  }
}

// Función para abrir un chat simulado
function openChat(professionalName) {
  showNotification(`Hola, soy ${professionalName}. ¿En qué puedo ayudarte hoy?`);
}

// Función para mostrar notificación
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
}

// Función para volver a la sección de profesionales
function goBackToProfessionals() {
  console.log("Volviendo a profesionales...");
  categoriesSection.classList.add('hidden');
  searchResultsSection.classList.remove('hidden');
  scheduleServiceSection.classList.add('hidden');

  // Depuración: Verificar el estado de las clases
  console.log("Categories Section ClassList:", categoriesSection.classList);
  console.log("Search Results Section ClassList:", searchResultsSection.classList);
  console.log("Schedule Service Section ClassList:", scheduleServiceSection.classList);
}

// Función para volver a la sección de categorías
function goBackToCategories() {
  console.log("Volviendo a categorías...");
  categoriesSection.classList.remove('hidden');
  searchResultsSection.classList.add('hidden');
  scheduleServiceSection.classList.add('hidden');

  // Depuración: Verificar el estado de las clases
  console.log("Categories Section ClassList:", categoriesSection.classList);
  console.log("Search Results Section ClassList:", searchResultsSection.classList);
  console.log("Schedule Service Section ClassList:", scheduleServiceSection.classList);
}

// Función para ir a la pantalla principal (al hacer clic en "Servi")
function goToHome() {
  console.log("Volviendo a la pantalla principal...");
  categoriesSection.classList.remove('hidden');
  searchResultsSection.classList.add('hidden');
  scheduleServiceSection.classList.add('hidden');

  // Depuración: Verificar el estado de las clases
  console.log("Categories Section ClassList:", categoriesSection.classList);
  console.log("Search Results Section ClassList:", searchResultsSection.classList);
  console.log("Schedule Service Section ClassList:", scheduleServiceSection.classList);
}

// Función para filtrar servicios mediante la barra de búsqueda
function filterServices() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const categories = document.querySelectorAll('.category-box');

  categories.forEach(category => {
    const categoryText = category.getAttribute('data-category').toLowerCase();
    if (categoryText.includes(searchInput)) {
      category.style.display = 'flex';
    } else {
      category.style.display = 'none';
    }
  });
}

// Añadir eventos de clic a las categorías
categoryBoxes.forEach(box => {
  const category = box.getAttribute('data-category');
  console.log("Categoría encontrada:", category);
  if (category) {
    box.addEventListener('click', () => {
      console.log("Clic en categoría:", category);
      showSearchResults(category);
    });
  }
});