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
         
      })
      .catch(() => {
        Swal.fire({
          position: "top-end",
          type: "error",
          title: "Error",
          showConfirmButton: false,
          timer: 1000
        });
      });
  };

  let verificarSesion = () => {
    firebase.auth().onAuthStateChanged(function() {

    });
  };
  verificarSesion();

  let boton = document.getElementById("btnIniciarSesion");
  boton.onclick = iniciarSesion;
};
