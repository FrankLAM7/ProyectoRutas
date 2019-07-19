import {
    firebaseConfig
} from "./variables.js";
import {
    compararStrings
} from './utils.js';


window.onload = () => {


    firebase.initializeApp(firebaseConfig);

    /**
     * Función para inciar sesión con Firebase
     */
    let iniciarSesion = (e) => {
        console.log(e);

        e.preventDefault();
        let email = $("#inputEmail").val();
        let password = $("#inputPassword").val();
        console.log(email, password);

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                //$("#modalIniciarSesion").modal("hide");
                console.log("se inicio sesion");
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Se inicio la sesion',
                    showConfirmButton: false,
                    timer: 1500
                })

            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    title: 'Error',
                    showConfirmButton: false,
                    timer: 1500
                })

            });
    }
    //iniciarSesion();


    let verificarSesion = () => {


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("Habia una sesion iniciada");
                console.log(user);


                // VAMOS A VER SI EL USUARIO YA ESTABA REGISTRADO EN LA
                // BASE DE DATOS EN TIEMPO REAL para crearlo o no crearlo

                console.log("se inicio sesion");

                console.log("se inicio sesion");
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Se inicio la sesion',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(email, password);

            } else {
                console.log("No habia una sesion iniciada o el usuario cerró sesion");

                //console.log(email,password);



            }
        });
    }



    verificarSesion();

    let boton = document.getElementById("btnIniciarSesion");
    boton.onclick= iniciarSesion;



}