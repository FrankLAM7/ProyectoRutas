import {
    firebaseConfig
} from "./variables.js";
import {
    compararStrings
} from './utils.js';


window.onload = () => {

    firebase.initializeApp(firebaseConfig);


    let crearCuenta = () => {
        let email = $("#inputEmail").val().trim();
        let password = $("#inputPassword").val().trim();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                //$("#modalCrearCuenta").modal("hide");

                Swal.fire({
                    type: 'success',
                    title: 'Exito ',
                    text: 'Se creo el usuario!',
                    //footer: '<a href>Why do I have this issue?</a>'
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            // abrir la siguiente pagina


        })
        .catch(function (error) {
            //console.log(error);
        });

    let cerrarSesion = (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                // redireccionar al index cuando la sesión se cierra

                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Se ha cerrado la sesion',
                    showConfirmButton: false,
                    timer: 1500
                })
                location = "./index.html";
            })
            .catch(() => {

            });
    }

    /**
     * Función para inciar sesión con Firebase
     */
    let iniciarSesion = () => {
        let email = $("#inputEmail").val().trim();
        let password = $("#inputPassword").val().trim();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                //$("#modalIniciarSesion").modal("hide");
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
    }


    let verificarSesion = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("Habia una sesion iniciada");
                console.log(user);
                

                // VAMOS A VER SI EL USUARIO YA ESTABA REGISTRADO EN LA
                // BASE DE DATOS EN TIEMPO REAL para crearlo o no crearlo

                refUsuarios.on("value", dataSnapshot => {
                    // existe => variable booleana
                    // true si el nodo "usuarios" ya tenia ese child
                    // false si el nodo "usuarios" no tenia ese child
                    let existe = dataSnapshot.hasChild(user.uid);
                    if (!existe) {
                        // crear al usuario en la realtimeDatabase
                        refUsuarios.child(user.uid).set({
                            email: user.email
                        }).then(() => {
                            Swal.fire({
                                position: 'top-end',
                                type: 'success',
                                title: 'Se ha cerrado la sesion',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        })
                    }
                });


            } else {
                console.log("No habia una sesion iniciada o el usuario cerró sesion");
                

                
            }
        });
    }

    verificarSesion();


   
    $("#inputPassword").keyup(function (e) {
        

        
    });

   


}

