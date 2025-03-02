// Cargar datos del usuario, favoritos, historial y reseñas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const historyList = document.getElementById('history-list');
  const favoritesList = document.getElementById('favorites-list');
  const reviewsList = document.getElementById('reviews-list');
  const reviewSection = document.getElementById('review-section');
  const submitReviewBtn = document.querySelector('.submit-review-btn');

  if (authenticatedUser) {
    userNameElement.textContent = authenticatedUser.name;
    userEmailElement.textContent = `Correo: ${authenticatedUser.email}`;
    document.getElementById('auth-link').innerHTML = `Hola, ${authenticatedUser.name}`;
    document.getElementById('auth-link').href = '#';
    document.getElementById('auth-link').onclick = () => window.location.href = 'profile.html';
    document.getElementById('profile-link').style.display = 'inline-block';
  } else {
    window.location.href = 'auth.html'; // Redirigir si no está autenticado
  }

  // Cargar favoritos
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p>No tienes profesionales favoritos.</p>';
  } else {
    favorites.forEach(fav => {
      const item = document.createElement('div');
      item.classList.add('favorite-item');
      item.innerHTML = `
        <p><strong>Profesional:</strong> ${fav.name}</p>
        <p><strong>Categoría:</strong> ${fav.category}</p>
      `;
      favoritesList.appendChild(item);
    });
  }

  // Cargar historial de servicios
  const history = JSON.parse(localStorage.getItem('serviceHistory')) || [];
  if (history.length === 0) {
    historyList.innerHTML = '<tr><td colspan="7">No tienes servicios solicitados.</td></tr>';
  } else {
    history.forEach((service, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${service.professional}</td>
        <td>${service.category}</td>
        <td>${service.urgent ? 'Urgente (Hoy)' : service.date}</td>
        <td>${service.time}</td>
        <td>${service.paymentMethod}</td>
        <td>${service.completed ? 'Completado' : 'Pendiente'}</td>
        <td>
          ${service.completed ? 
            'Reseña Enviada' : 
            `
            <button class="confirm-reception-btn" onclick="confirmReception(${index}, '${service.professional}', '${service.category}')">Confirmar Recepción</button>
            <button class="cancel-service-btn" onclick="cancelService(${index})">Cancelar</button>
            `
          }
        </td>
      `;
      historyList.appendChild(row);
    });
  }

  // Cargar reseñas realizadas
  const reviews = JSON.parse(localStorage.getItem('professionalReviews')) || [];
  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>No has realizado reseñas.</p>';
  } else {
    reviews.forEach(review => {
      const item = document.createElement('div');
      item.classList.add('review-item');
      item.innerHTML = `
        <p><strong>Profesional:</strong> ${review.professional || 'Desconocido'}</p>
        <p><strong>Categoría:</strong> ${review.category || 'Desconocida'}</p>
        <p><strong>Calificación:</strong> ${review.rating}/5</p>
        <p><strong>Comentario:</strong> ${review.comment}</p>
      `;
      reviewsList.appendChild(item);
    });
  }

  // Mostrar el formulario de reseña si hay datos temporales
  const currentReviewProfessional = localStorage.getItem('currentReviewProfessional');
  const currentReviewCategory = localStorage.getItem('currentReviewCategory');
  if (currentReviewProfessional && currentReviewCategory) {
    const reviewProfessionalNameElement = document.getElementById('review-professional-name');
    reviewSection.classList.remove('hidden');
    reviewSection.style.display = 'block';
    reviewProfessionalNameElement.textContent = currentReviewProfessional;
  }

  // Asegurarse de que el formulario no se envíe automáticamente
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Evitar comportamiento predeterminado
      submitReview();
    });
  }
});

// Función para confirmar la recepción del servicio
function confirmReception(index, professionalName, category) {
  const history = JSON.parse(localStorage.getItem('serviceHistory')) || [];
  history[index].completed = true;
  localStorage.setItem('serviceHistory', JSON.stringify(history));

  // Guardar datos temporales para la reseña
  localStorage.setItem('currentReviewIndex', index);
  localStorage.setItem('currentReviewProfessional', professionalName);
  localStorage.setItem('currentReviewCategory', category);

  // Mostrar el formulario de reseña sin recargar la página
  const reviewSection = document.getElementById('review-section');
  const reviewProfessionalNameElement = document.getElementById('review-professional-name');
  reviewSection.classList.remove('hidden');
  reviewSection.style.display = 'block';
  reviewProfessionalNameElement.textContent = professionalName;

  // Desplazar la página al formulario de reseña
  reviewSection.scrollIntoView({ behavior: 'smooth' });
}

// Función para enviar una reseña
function submitReview() {
  const rating = document.getElementById('review-rating').value;
  const comment = document.getElementById('review-comment').value;

  if (!rating || !comment) {
    alert('Por favor, completa todos los campos de la reseña.');
    return;
  }

  const professional = localStorage.getItem('currentReviewProfessional');
  const category = localStorage.getItem('currentReviewCategory');

  if (!professional || !category) {
    alert('Error: No se encontraron datos del servicio para la reseña.');
    return;
  }

  const review = {
    professional: professional,
    category: category,
    rating: parseInt(rating),
    comment: comment
  };

  // Guardar la reseña en el historial
  const reviews = JSON.parse(localStorage.getItem('professionalReviews')) || [];
  // Evitar duplicados verificando si ya existe una reseña para este servicio
  const existingReview = reviews.find(r => 
    r.professional === professional && 
    r.category === category && 
    r.rating === review.rating && 
    r.comment === review.comment
  );
  if (!existingReview) {
    reviews.push(review);
    localStorage.setItem('professionalReviews', JSON.stringify(reviews));
  } else {
    console.log("Reseña duplicada detectada, no se guardará nuevamente.");
  }

  // Limpiar datos temporales
  localStorage.removeItem('currentReviewIndex');
  localStorage.removeItem('currentReviewProfessional');
  localStorage.removeItem('currentReviewCategory');

  // Mostrar notificación
  alert('¡Gracias por tu reseña!');

  // Recargar la página para actualizar las reseñas y el historial
  window.location.reload();
}

// Función para cancelar un servicio
function cancelService(index) {
  if (confirm('¿Estás seguro de que deseas cancelar este servicio?')) {
    const history = JSON.parse(localStorage.getItem('serviceHistory')) || [];
    history.splice(index, 1); // Eliminar el servicio del historial
    localStorage.setItem('serviceHistory', JSON.stringify(history));
    window.location.reload(); // Recargar para actualizar el historial
  }
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('authenticatedUser');
  localStorage.removeItem('serviceHistory');
  localStorage.removeItem('favorites');
  localStorage.removeItem('professionalReviews');
  window.location.href = 'index.html';
}

// Función para redirigir a la página principal
function goToHome() {
  window.location.href = 'index.html';
}