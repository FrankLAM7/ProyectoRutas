import {firebaseConfig, default_center} from './variables.js';
$(()=>{
    firebase.initializeApp(firebaseConfig);

    var map_ida;
    var map_vuelta;
    var zoom_map = 10;
    var coords_collec_ida = [];
    var coords_collec_vuelta = [];
    var reference_empresa = firebase.database().ref('rutas');
    var reference_file = firebase.storage().ref('rutas');

    let make_maps = ()=>{

    map_ida = new google.maps.Map(document.getElementById('map_ida'), {
        center: default_center,
        zoom: zoom_map
        // styles: styles_map
    });

    map_vuelta = new google.maps.Map(document.getElementById('map_vuelta'), {
        center: default_center,
        zoom: zoom_map
        // styles: styles_map
    });
    }

    var listeners_config = ()=>{
        map_ida.addListener('click', (event)=>{

        //   console.log(event.latLng.lat());
        //   console.log(event.latLng.lng());
  
          let new_marker = new google.maps.Marker(
            {position: {
                lat: event.latLng.lat(), 
                lng: event.latLng.lng()
            },
             map: map_ida
            });
  
        // let info_marker = new google.maps.InfoWindow({
        //   content: info,
        //   maxWidth: 200
        // });
  
        new_marker.addListener('click', ()=>{
          info_marker.open(map_ida, new_marker);
        });
  
        let objt_cords = {
          lat:event.latLng.lat(),
          lng:event.latLng.lng()
        }
        coords_collec_ida.push(objt_cords);
  
        var line = new google.maps.Polyline({
          path: coords_collec_ida,
          geodesic: true,
          strokeColor: 'blue',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
  
        line.setMap(map_ida);
  
        });
  
        map_vuelta.addListener('click', (event)=>{

            // console.log(event.latLng.lat());
            // console.log(event.latLng.lng());
    
            let new_marker = new google.maps.Marker(
              {position: {
                  lat: event.latLng.lat(), 
                  lng: event.latLng.lng()
              },
               map: map_vuelta
              });
    
    
          new_marker.addListener('click', ()=>{
            info_marker.open(map_vuelta, new_marker);
          });
    
          let objt_cords = {
            lat:event.latLng.lat(),
            lng:event.latLng.lng()
          }
          coords_collec_vuelta.push(objt_cords);
    
          var line = new google.maps.Polyline({
            path: coords_collec_vuelta,
            geodesic: true,
            strokeColor: 'green',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
    
          line.setMap(map_vuelta);
    
          });
        //   console.log(coords_collec_ida);
        //   console.log(coords_collec_vuelta);
    }

    let photo_upload = (key)=>{
        
        let photo = document.getElementById('photo');
        // console.log(photo.files);
        
        let storage = firebase.storage();
        
        let content_file = storage.ref('rutas');
        
        // console.log(photo.files[0].name);

        let new_name = `${key}`;
        
        
        let meta_data = {contentType: photo.files[0].type};
        
        content_file.child(new_name)
                    .put(photo.files[0], meta_data)
                    .then((data)=>{
                        // console.log(data);
                        return data.ref.getDownloadURL();
                    })
                    .then((url)=>{
                        
                        // console.log(url);

                        let reference_temp = firebase.database().ref('rutas').child(key);
                        return reference_temp.update({img: url});
                    }).then(()=>{
                        // console.log('image was updated');
                        // $.notify("La imagen de la empresa fue añadida correctamente", "success");
                        console.log("La imagen de la empresa fue añadida correctamente");
                        
                        clean_parameters();
                    })
                    .catch((error)=>{
                        console.log(error);
                        $.notify("No se ha podido registrar tu imagen, por favor contacta al administrador", "error");
                    });
        }

    let make_empresa_firebase = ()=>{
        
        let key = reference_empresa.push().key;

        let new_reference = reference_empresa.child(key);

        new_reference.set({
            nombre: $('#name').val().trim(),
            ida: coords_collec_ida,
            vuelta: coords_collec_vuelta
        }).then((data)=>{

            photo_upload(key);
            $.notify("La empresa fue creada con exito", "success");
        }).catch((error)=>{
            console.log(error);
            $.notify("No se ha podido registrar tu empresa, por favor contacta al administrador", "error");
        });
    }

    let clean_parameters = ()=>{
        $('#form').trigger("reset");
        // console.log('clean');
        coords_collec_ida = [];
        coords_collec_vuelta = [];
        make_maps();
    }

    let verified_session = ()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if (user) {

              $('#correoUsuario').html(user.email);

            } else {
                // location = './index.html';
            }
        });
    }

    let log_out = (event)=>{
        firebase.auth().signOut()
        .then(()=>{
            location="./index.html";
        }).catch(()=>{

        });
    }

    $('#btn_close_session').click((event)=>{
        event.preventDefault();
        clean_parameters();
        log_out();
    });

    $('#save').click(()=>{
        make_empresa_firebase();
        
    });

    $("#btnVolver").click((e)=>{
        e.preventDefault();
        location = "./principal.html";
    });

    make_maps();
    verified_session();
    listeners_config();

    // console.log(map_ida);
    // console.log(map_vuelta);

})