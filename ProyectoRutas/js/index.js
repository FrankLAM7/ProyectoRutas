import { firebaseConfig } from './variables.js';
import { compararStrings } from './variables.js';
window.onload =()=>{
    firebase.initializeApp(firebaseConfig);

    let refUsuarios = firebase.database().ref("usuarios");
    /**
         * Funcion para iniciar sesion con FIREBASE
         */
        let iniciarSesion = (e) => {
            e.preventDefault();
            let email = $("#email").val().trim();
            let password = $("#password").val().trim();
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    Swal.fire({
                        position: "top-end",
                        type: "success",
                        title: "Se inicio la sesion",
                        showConfirmButton: false,
                        timer: 1200
                      }).then(()=>{
                        location = "./principal.html";
                      }).catch();
                    
                }).catch(function (error) {
                    Swal.fire({
                        position: "top-end",
                        type: "error",
                        title: "Error",
                        showConfirmButton: false,
                        timer: 1000
                      }).then(()=>{
                          $("#login").trigger("reset");
                      });
                    console.log(error);
                });
        }
     /**
         * Funcion para cerrar sesion de FIREBASE
         */
        let cerrarSesion = (e) => {
            e.preventDefault();
            firebase.auth().signOut()
                .then(() => {
                    //redireccionar al index cuando la sesion se cierra
                    location = "./index.html";
                }).catch((error) => {
                    console.log(error);

                });
        }
    /**
         * Funcion para crear una cuenta en FIREBASE
         */
        let crearCuenta = () => {
            // console.log($("#inputPerfil").val());
            let email = $("#inputCrearEmail").val().trim();
            let password = $("#inputCrearPassword1").val().trim();
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    $("#modalCrearCuenta").modal("hide");
                }).catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error.message);
                });

        }
    /**
         * Funcion para abrir modal de crear cuenta
         * @param {*} e evento click del boton
         */
        let abirModalCrearCuenta = (e) => {
            e.preventDefault();            
            $("#modalCrearCuenta").modal("show");
        }

        let verificarSesion = () => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log("Habia una sesion iniciada");
                    console.log(user);
                    $("#btnUsuario").html(`${user.email}`);
                    $("#btnCerrarSesion").show();
                    $("#correoUsuario").html(user.email);

                    //VERIFICAR SI USUARIO YA ESTABA REGISTRADO EN LA
                    //BASE DE DATOS EN TIEMPO REAL PARA CREARLO O NO CREARLO
                    refUsuarios.on("value", (dataSnapshot) => {
                        let existe = dataSnapshot.hasChild(user.uid);
                        if (!existe) {
                            //crear al usuario en la realtimeData
                            refUsuarios.child(user.uid).set({
                                email: user.email,
                                perfil: $("#inputPerfil").val()
                            }).then(() => {
                                $.notify("Usuario registrado correctamente", "success");
                            });
                        } else {

                        }

                    });


                } else {
                    // User is signed out.
                    console.log("No habia una sesion iniciada o el usuario cerró sesion");

                    $("#btnUsuario").html("Iniciar Sesion");
                    $("#btnRegistrar").show();
                    $("#btnIniciarSesion").show();
                    $("#btnCerrarSesion").hide();
                }
            });
        }
        verificarSesion();
        //configurar la validación de contraseñas
        $("#inputCrearPassword2").keyup(function (e) {
            let iguales = compararStrings($("#inputCrearPassword1").val().trim(),
                $(this).val().trim());
            console.log(iguales);
            if (!iguales) {
                $("#helpPassword").html("Las contraseñas no coinciden");
                $("#helpPassword").removeAttr("hidden");
                $("#helpPassword").attr("class", "form-text text-danger");
                $(this).attr("class", "form-control is-invalid");
                $("#btnCrearCuenta").attr("disabled", "true");
            } else {
                $("#helpPassword").html("");
                $(this).attr("class", "form-control is-valid");
                $("#btnCrearCuenta").removeAttr("disabled");
            }
        });

        $("#btnCerrarSesion").click(cerrarSesion);
        /**
         * Boton para registrar usuario
         */
        $("#btnCrearCuenta").click(crearCuenta);
        $("#abrirModalCrearCuenta").click(abirModalCrearCuenta);

        $("#btnIniciarSesion").click(iniciarSesion);
}