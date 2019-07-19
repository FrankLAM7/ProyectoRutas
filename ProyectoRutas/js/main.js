import { firebaseConfig } from './variables.js';

window.onload = () => {
    firebase.initializeApp(firebaseConfig);

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

                //VERIFICAR SI USUARIO YA ESTABA REGISTRADO EN LA
                //BASE DE DATOS EN TIEMPO REAL PARA CREARLO O NO CREARLO
                // refUsuarios.on("value",(dataSnapshot) =>{
                //     let existe = dataSnapshot.hasChild(user.uid);
                //     if(!existe){
                //         //crear al usuario en la realtimeData
                //         refUsuarios.child(user.uid).set({
                //             email: user.email
                //         }).then(()=>{
                //             $.notify("Usuario registrado correctamente","success");
                //         });
                //     }else{
                //     }
                // });


            } else {
                // User is signed out.
                console.log("No habia una sesion iniciada o el usuario cerró sesion");
                //location = "./index.html";
                // $("#btnUsuario").html("Iniciar Sesion");
                // $("#btnRegistrar").show();
                // $("#btnIniciarSesion").show();
                // $("#btnCerrarSesion").hide();
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
        
        location = "./verRutas.html";
    });
    /**
    * Boton para cerrar sesion
    */
    $("#btnCerrarSesion").click(cerrarSesion);
    verificarSesion();
}