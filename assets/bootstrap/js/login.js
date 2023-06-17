
document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if (email === 'Webmaps@Webmaps.com' && password === '123456') {
    localStorage.setItem('email', email);

    Swal.fire({
      icon: 'success',
      title: 'Acceso Correcto',
      text: '¡Bienvenido!',
      showConfirmButton: false,
      timer: 2000 // Cerrar automáticamente después de 2 segundos
    }).then(function () {
      // Redireccionar al dashboard después de mostrar la alerta
      window.location.href = 'dashboard.html';
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Fallido',
      text: 'Usuario o contraseña incorrectos',
      confirmButtonText: 'OK'
    });
  }
});
