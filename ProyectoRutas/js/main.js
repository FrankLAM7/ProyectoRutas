import { firebaseConfig } from './variables.js';

window.onload = () => {
    firebase.initializeApp(firebaseConfig);
    let refUsuarios = firebase.database().ref("usuarios");

    let cerrarSesion =(e)=>{
        e.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                //redireccionar al index cuando la sesion se cierra
                location = "./index.html";
            }).catch((error) => {
                console.log(error);
            });
    }
    let verificarSesion = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("Habia una sesion iniciada");
                console.log(user);
                $("#btnUsuario").html(`${user.email}`);
                $("#btnRegistrar").hide();
                $("#btnIniciarSesion").hide();
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
                        refUsuarios.once("value",dataSnapshot =>{

                            let data = dataSnapshot.child(user.uid).val();
                            console.log(data);
                            if(data.perfil !="Administrador"){
                                $("#btnCrearRutas").addClass("disabled");
                                $("#btnCrearRutas>*").addClass("hidden")
                            }
                        });
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
    
    /**
     * Boton crear Ruta
     */
    $("#btnCrearRutas").click(()=>{
        console.log("click");
        
        location = "./crearRutas.html";
    });
    $("#btnVerRutas").click(()=>{
        console.log("click");
        
        location = "./listasempresas.html";
    });
    /**
    * Boton para cerrar sesion
    */
    $("#btnCerrarSesion").click(cerrarSesion);
    verificarSesion();
}