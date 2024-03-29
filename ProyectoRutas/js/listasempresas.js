import { estiloMapa, centroPorDefecto, firebaseConfig } from './variables.js';

window.onload = () => {

    //Inicializando la BD de Firebase
    firebase.initializeApp(firebaseConfig);
    let refUsuarios = firebase.database().ref("usuarios");
    var Usuario;
    
    // Array con la lista de Empresas
    let ArrayEmpresas = [];

    /* Funcion para cerrar sesion de FIREBASE
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

    let mapaGoogle = new google.maps.Map(document.getElementById('mapa'), {
        center: centroPorDefecto,
        zoom: 8,
        styles: estiloMapa
    });

    let posicionActual = () => {
        // solicitar permiso de acceso a ubicacion al navegador
        if (navigator.geolocation) {
            // getCurrentPosition(posicion) => funcion que devuelve
            // información de la ubicación del equipo (coordenadas)
            navigator.geolocation.getCurrentPosition(posicion => {
                // forma 1 => xvr
                let { latitude, longitude } = posicion.coords;
                var marcador = new google.maps.Marker(
                    {
                        position: {
                            lat: latitude,
                            lng: longitude
                        },
                        map: mapaGoogle,
                        title: "Aquí estoy"
                    });
                // funcion para centrar el mapa de Google en una latitud y longitud
                // personalizada
                mapaGoogle.setCenter({
                    lat: latitude,
                    lng: longitude
                });
                // funcion para acercar o alejar la camara del visualizador del mapa
                mapaGoogle.setZoom(16);
            }, error => {
                $.notify("No se han concedido permisos para acceder a tu ubicación", "error");
                console.log(error);
            })
        } else {
            console.log("El navegador no posee geolocalización");
        }
    }

    if (location.href.indexOf("listasempresas") >= 0) {
        let refEmpresas = firebase.database().ref("rutas");
        //ida
        //vuelta
        //nombre

       
        let renderizarDatos = DataSnapshot => {
            console.log("limpiando");

            $("#listaEmpresas").html("");
            ArrayEmpresas = [];
            // Capturando los datos y guardarlos en un Array
            DataSnapshot.forEach(item => {
                console.log(`${item.val().nombre} - ${item.val().ida} - ${item.val().vuelta}`);
                ArrayEmpresas.push({
                    key: item.key,
                    nombre: item.val().nombre,
                    ida: item.val().ida,
                    vuelta: item.val().vuelta,
                });
            });

            var lineaIda2 = new google.maps.Polyline(null);
            var lineaVuelta2 = new google.maps.Polyline(null);
            // Iterando el array con el dato de las empresas
            ArrayEmpresas.forEach(item => {
                let listGroupItem = $(`<li class="list-group-item d-flex justify-content-between align-items-center"></li>`);
                let aItem = $(`<a href="#" >${item.nombre}</a>`);

                let buttonItem = $(`<button type="button" class="btn btn-danger">Eliminar</button>`);


                console.log(item);
                listGroupItem.append(aItem);
                console.log(Usuario);
                if (Usuario == "Administrador") {
                    listGroupItem.append(buttonItem);
                }


                //debugger;
                $("#listaEmpresas").append(listGroupItem);

                // Evento de las listas
                aItem.click((e) => {

                    e.preventDefault();

                    polilinea(lineaIda2, lineaVuelta2);

                    var lineaIda = new google.maps.Polyline({
                        path: item.ida,
                        geodesic: true,
                        strokeColor: '#F26419',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    lineaIda.setMap(mapaGoogle);
                    posicionActual(item.ida[0].lat, item.ida[0].lng, "IDA");

                    var lineaVuelta = new google.maps.Polyline({
                        path: item.vuelta,
                        geodesic: true,
                        strokeColor: '#86bbd8',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    lineaVuelta.setMap(mapaGoogle);
                    posicionActual(item.vuelta[0].lat, item.vuelta[0].lng, "Vuelta");

                    lineaIda2 = lineaIda;
                    lineaVuelta2 = lineaVuelta;
                });

                buttonItem.click((e) => {
                    e.preventDefault();
                    $("#listaEmpresas").html("");
                    deleteRegistro(item.key);
                })
            });
        }

        let polilinea = (lineaIda, lineaVuelta) => {
            lineaIda.setMap(null);
            lineaVuelta.setMap(null);
        }

        let posicionActual = (latitude, longitude, titulo) => {
            // solicitar permiso de acceso a ubicacion al navegador
            if (navigator.geolocation) {
                // getCurrentPosition(posicion) => funcion que devuelve
                // información de la ubicación del equipo (coordenadas)
                navigator.geolocation.getCurrentPosition(() => {
                    // forma 1 => xvr
                    //let { latitude, longitude } = posicion.coords;
                    /* var marcador = new google.maps.Marker(
                        {
                            position: {
                                lat: latitude,
                                lng: longitude
                            },
                            map: mapaGoogle
                            //title: titulo
                        }); */
                    // funcion para centrar el mapa de Google en una latitud y longitud
                    // personalizada
                    mapaGoogle.setCenter({
                        lat: latitude,
                        lng: longitude
                    });
                    // funcion para acercar o alejar la camara del visualizador del mapa
                    mapaGoogle.setZoom(10);
                }, error => {
                    $.notify("No se han concedido permisos para acceder a tu ubicación", "error");
                    console.log(error);
                })
            } else {
                console.log("El navegador no posee geolocalización");
            }
        }

        let getDatos = () => {
            $("#listaEmpresas").html(`<div class="text-center"><div class="spinner-grow" role="status">
            <span class="sr-only">Loading...</span>
          </div></div>`);
            refEmpresas.on("value", dataSnapshot => {
                renderizarDatos(dataSnapshot);
            });
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
                            refUsuarios.once("value",dataSnapshot =>{
                                let data = dataSnapshot.child(user.uid).val();
                                console.log(data);
                                Usuario = data.perfil;
                                getDatos();
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
        verificarSesion();  

        //getDatos();

        /**
         * Funcion para eliminar un registro de la DB de firebase
         */
        let deleteRegistro = (key) => {
            /**
             * 1. Crear la referencia al nodo a eliminar
             */
            let refKey = refEmpresas.child(key);
            // let refKey = firebase.database().ref("platos").child(key);
            // let refKey = firebase.database().ref(`platos/${key}`);
            refKey.remove()
                .then(() => {
                    $.notify("El elemento, se ha eliminado correctamente", "success")
                })
                .catch(error => {
                    $.notify("Ups! ocurrió un error", "error");
                    console.log(error);
                });
        }
        

    }

   

    posicionActual();

    $("#btnCerrarSesion").click(cerrarSesion);

    $("#btnVolver").click((e) => {
        e.preventDefault();
        location = "./principal.html";
    });
}