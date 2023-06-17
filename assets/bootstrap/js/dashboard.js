// Obtener el correo electrónico del usuario del Local Storage
var email = localStorage.getItem('email');

// Mostrar el correo electrónico en el h1 del dashboard
var welcomeHeading = document.getElementById('welcome-heading');
if (email) {
  welcomeHeading.textContent = '¡Bienvenido, ' + email + '!';
} else {
  welcomeHeading.textContent = '¡Bienvenido!';
}

// Función para cerrar la sesión
function logout() {
  // Mostrar alerta de confirmación usando Sweet Alert
  Swal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    text: 'Se cerrará la sesión actual',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(function (result) {
    if (result.isConfirmed) {
      // Borrar el correo electrónico del usuario del Local Storage
      localStorage.removeItem('email');

      // Redireccionar al inicio
      window.location.href = 'index.html';
    }
  });
}

// Obtener el correo electrónico del usuario del Local Storage
var email = localStorage.getItem('email');

// Verificar si el usuario ha iniciado sesión
if (!email) {
  // Redireccionar al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
}

// Variables globales
var tableBody = document.getElementById('table-body');
var userForm = document.getElementById('userForm');
var userModalEditar = document.getElementById('exampleModalEditar');

// Evento de envío del formulario
userForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var nombre = document.getElementById('nombre').value;
  var pais = document.getElementById('pais').value;
  var estado = document.getElementById('estado').value;
  var genero = document.getElementById('genero').value;
  var fotoInput = document.getElementById('foto');
  var foto = '';

  // Validar que se haya seleccionado una imagen
  if (fotoInput.files.length > 0) {
    var reader = new FileReader();
    reader.onload = function (event) {
      foto = event.target.result;
      saveUser(foto, nombre, pais, estado, genero);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    saveUser(foto, nombre, pais, estado, genero);
  }
});

// Evento de apertura del modal de edición
tableBody.addEventListener('click', function (event) {
  if (event.target.matches('.btn-edit')) {
    var row = event.target.closest('tr');
    var nombre = row.cells[1].textContent;

    // Obtener el usuario del Local Storage por el nombre
    var userList = JSON.parse(localStorage.getItem('userList')) || [];
    var user = userList.find(function (user) {
      return user.nombre === nombre;
    });

    if (user) {
      // Establecer los valores en los campos del formulario en el modal de edición
      var nombreInput = userModalEditar.querySelector('#nombre');
      var paisSelect = userModalEditar.querySelector('#pais');
      var estadoSelect = userModalEditar.querySelector('#estado');
      var generoSelect = userModalEditar.querySelector('#genero');

      nombreInput.value = user.nombre;
      paisSelect.value = user.pais;
      estadoSelect.value = user.estado;
      generoSelect.value = user.genero;
    }

    // Abrir el modal de edición
    var editModal = new bootstrap.Modal(userModalEditar);
    editModal.show();
  }
});


// Guardar usuario en el Local Storage y crear fila en la tabla
function saveUser(foto, nombre, pais, estado, genero) {
  // Obtener lista de usuarios existente en el Local Storage
  var userList = JSON.parse(localStorage.getItem('userList')) || [];

  // Crear un nuevo objeto de usuario
  var newUser = {
    foto: foto,
    nombre: nombre,
    pais: pais,
    estado: estado,
    genero: genero
  };

  // Agregar el nuevo usuario a la lista
  userList.push(newUser);

  // Guardar la lista de usuarios actualizada en el Local Storage
  localStorage.setItem('userList', JSON.stringify(userList));

  // Crear una nueva fila en la tabla
  createUserRow(newUser);

  // Limpiar el formulario y cerrar el modal
  userForm.reset();
  $('#exampleModal').modal('hide');

  // Mostrar mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: 'Usuario agregado',
    text: 'El usuario ha sido agregado correctamente.',
    confirmButtonText: 'OK'
  });
}

// Crear fila de usuario en la tabla
function createUserRow(user) {
  // Crear una nueva fila
  var newRow = document.createElement('tr');

  // Crear celdas para cada dato del usuario
  var nombreCell = document.createElement('td');
  var fotoCell = document.createElement('td');
  var paisCell = document.createElement('td');
  var estadoCell = document.createElement('td');
  var generoCell = document.createElement('td');
  var actionsCell = document.createElement('td');

  // Agregar contenido a las celdas
  nombreCell.textContent = user.nombre;

  var fotoImg = document.createElement('img');
  fotoImg.src = user.foto;
  fotoImg.width = 56;
  fotoImg.height = 50;
  fotoImg.classList.add('rounded-circle');
  fotoCell.appendChild(fotoImg);

  paisCell.textContent = user.pais;
  estadoCell.textContent = user.estado;
  generoCell.textContent = user.genero;

  var deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-trash', 'mx-3');
  deleteButton.type = 'button';
  deleteButton.style.borderTopStyle = 'none';
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  actionsCell.appendChild(deleteButton);

  var editButton = document.createElement('button');
  editButton.classList.add('btn', 'btn-edit', 'mx-3');
  editButton.type = 'button';
  editButton.style.borderTopStyle = 'none';
  editButton.setAttribute('data-bs-toggle', 'modal');
  editButton.setAttribute('data-bs-target', '#exampleModalEditar');
  editButton.innerHTML = '<i class="bi bi-pencil"></i>';
  actionsCell.appendChild(editButton);

  // Agregar las celdas a la fila
  newRow.appendChild(fotoCell);
  newRow.appendChild(nombreCell);
  newRow.appendChild(generoCell);
  newRow.appendChild(paisCell);
  newRow.appendChild(estadoCell);
  newRow.appendChild(actionsCell);

  // Agregar la nueva fila a la tabla
  tableBody.appendChild(newRow);
}

// Cargar usuarios almacenados en el Local Storage al cargar la página
window.addEventListener('DOMContentLoaded', function () {
  var userList = JSON.parse(localStorage.getItem('userList')) || [];

  for (var i = 0; i < userList.length; i++) {
    createUserRow(userList[i]);
  }
});

// Manejar el evento de eliminación o edición del usuario
tableBody.addEventListener('click', function (event) {
  if (event.target.matches('.btn-trash')) {
    var row = event.target.closest('tr');
    var nombre = row.cells[1].textContent;

    // Eliminar el usuario del Local Storage
    var userList = JSON.parse(localStorage.getItem('userList')) || [];
    var updatedList = userList.filter(function (user) {
      return user.nombre !== nombre;
    });
    localStorage.setItem('userList', JSON.stringify(updatedList));

    // Eliminar la fila de la tabla
    row.remove();

    // Mostrar mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: 'Usuario eliminado',
      text: 'El usuario ha sido eliminado correctamente.',
      confirmButtonText: 'OK'
    });
  } else if (event.target.matches('.btn-edit')) {
    var row = event.target.closest('tr');
    var nombre = row.cells[1].textContent;

    // Obtener el usuario del Local Storage
    var userList = JSON.parse(localStorage.getItem('userList')) || [];
    var user = userList.find(function (user) {
      return user.nombre === nombre;
    });

    // Completar los campos del formulario de edición con los datos del usuario
    var formEditar = document.getElementById('userFormEditar');
    formEditar.nombre.value = user.nombre;
    formEditar.pais.value = user.pais;
    formEditar.estado.value = user.estado;
    formEditar.genero.value = user.genero;

    // Manejar el evento de clic en el botón "Confirmar" del formulario de edición
    var btnConfirmar = document.getElementById('btnConfirmarEditar');
    btnConfirmar.addEventListener('click', function (event) {
      event.preventDefault();

      // Actualizar los datos del usuario en el Local Storage
      user.nombre = formEditar.nombre.value;
      user.pais = formEditar.pais.value;
      user.estado = formEditar.estado.value;
      user.genero = formEditar.genero.value;

      // Actualizar el Local Storage con la lista de usuarios actualizada
      localStorage.setItem('userList', JSON.stringify(userList));

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'Los datos del usuario se han actualizado correctamente.',
        confirmButtonText: 'OK'

      }).then(function () {
        location.reload();
      });

      // Cerrar el modal de edición
      var modalEditar = document.getElementById('exampleModalEditar');
      var bootstrapModal = bootstrap.Modal.getInstance(modalEditar);
      bootstrapModal.hide();
    });
  }
});

// Obtener el elemento donde se mostrará el filtro seleccionado
var filterSelections = document.getElementById('filterSelections');
var checkboxes = document.querySelectorAll('.dropdown-menusub input[type="checkbox"]');
var selectedFilters = []; // Variable para almacenar los filtros seleccionados

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    selectedFilters = Array.from(checkboxes)
      .filter(function (checkbox) {
        return checkbox.checked;
      })
      .map(function (checkbox) {
        var filterType = checkbox.parentNode.parentNode.parentNode.previousElementSibling.textContent.trim();
        var filterValue = checkbox.labels[0].textContent.trim();
        return filterType + ': ' + filterValue;
      });

    renderSelectedFilters();
  });
});

function renderSelectedFilters() {
  filterSelections.innerHTML = '';

  selectedFilters.forEach(function (filter) {
    var filterButton = document.createElement('button');
    filterButton.classList.add('btn', 'btn-sm', 'btn-info', 'me-2');
    filterButton.innerHTML = filter + '<i class="bi bi-x-lg"></i>';
    filterButton.addEventListener('click', function () {
      var filterText = filterButton.textContent.trim();
      selectedFilters = selectedFilters.filter(function (selectedFilter) {
        return selectedFilter !== filterText;
      });
      renderSelectedFilters();
    });
    filterSelections.appendChild(filterButton);
  });
}

// Obtener el arreglo de los nombres de los usuarios del Local Storage y mostrarlos en clientesList 
var clientesList = document.getElementById('clientesList');
var userList = JSON.parse(localStorage.getItem('userList')) || [];
for (var i = 0; i < userList.length; i++) {
  var user = userList[i];
  var cliente = document.createElement('li');
  cliente.classList.add('list-group-item');
  cliente.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox" id="' + user.nombre + '" value="' + user.nombre + '"><label class="form-check-label" for="' + user.nombre + '">' + user.nombre + '</label></div>';
  clientesList.appendChild(cliente);
}

// Obtener el botón de filtrar
var filterButton = document.getElementById('filterDropdown');

// Agregar el evento de escucha al botón de filtrar
filterButton.addEventListener('click', applyFilters);

function applyFilters() {
  // Obtener los valores seleccionados de los filtros
  var selectedClientes = getSelectedValues('clientesList');
  var selectedGenero = getSelectedValues('filterGenero');
  var selectedPais = getSelectedValues('filterPais');
  var selectedEstado = getSelectedValues('filterEstado');

  // Obtener todas las filas de la tabla
  var rows = tableBody.getElementsByTagName('tr');

  // Recorrer todas las filas y mostrar/ocultar según los criterios de filtrado
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var cliente = row.cells[1].textContent;
    var genero = row.cells[2].textContent;
    var pais = row.cells[3].textContent;
    var estado = row.cells[4].textContent;

    // Mostrar u ocultar la fila según los filtros seleccionados
    var shouldShowRow =
      (selectedClientes.length === 0 || selectedClientes.includes(cliente)) &&
      (selectedGenero.length === 0 || selectedGenero.includes(genero)) &&
      (selectedPais.length === 0 || selectedPais.includes(pais)) &&
      (selectedEstado.length === 0 || selectedEstado.includes(estado));

    row.style.display = shouldShowRow ? 'table-row' : 'none';
  }
}

// Función auxiliar para obtener los valores seleccionados de una lista de checkboxes
function getSelectedValues(listId) {
  var checkboxes = document.querySelectorAll('#' + listId + ' input[type="checkbox"]:checked');
  var values = [];
  checkboxes.forEach(function (checkbox) {
    values.push(checkbox.value);
  });
  return values;
}
