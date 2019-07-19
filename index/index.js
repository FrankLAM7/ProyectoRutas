import { firebaseConfig } from "./variables.js";

window.onload = () => {
  firebase.initializeApp(firebaseConfig);

  let iniciarSesion = e => {
    e.preventDefault();
    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Swal.fire({
          position: "top-end",
          type: "success",
          title: "Se inicio la sesion",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(() => {
        Swal.fire({
          position: "top-end",
          type: "error",
          title: "Error",
          showConfirmButton: false,
          timer: 1500
        });
      });
  };

  let verificarSesion = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        Swal.fire({
          position: "top-end",
          type: "success",
          title: "Se inicio la sesion",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
      }
    });
  };
  verificarSesion();

  let boton = document.getElementById("btnIniciarSesion");
  boton.onclick = iniciarSesion;
};
