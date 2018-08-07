// Call the dataTables jQuery plugin

$(document).ready(function() {
    window.mdes = [];
    let activeIndex = -1;
    let api_url = "";
    const page = $("#page-name").val();
    if (page == 'onboard') {
        api_url = "/onboard/get";
    }
    if (page == 'about') {
        api_url = "/about/get";
    }
    if (page == 'track-edit') {
        api_url = "/track/track-get";
        var init_value = $('meta[name=init_value]').attr('content');
        // $("ol.simple_with_animation").sortable({
        //     group: 'simple_with_animation',
        //     pullPlaceholder: true,
        //     // animation on drop
        //     onDrop: function  ($item, container, _super) {
        //       var $clonedItem = $('<li/>').css({height: 0});
        //       $item.before($clonedItem);
        //       $clonedItem.animate({'height': $item.height()});
          
        //       $item.animate($clonedItem.position(), function  () {
        //         $clonedItem.detach();
        //         _super($item, container);
        //       });
        //     },
          
        //     // set $item relative to cursor position
        //     onDragStart: function ($item, container, _super) {
        //       var offset = $item.offset(),
        //           pointer = container.rootGroup.pointer;
          
        //       adjustment = {
        //         left: pointer.left - offset.left,
        //         top: pointer.top - offset.top
        //       };
          
        //       _super($item, container);
        //     },
        //     onDrag: function ($item, position) {
        //       $item.css({
        //         left: position.left - adjustment.left,
        //         top: position.top - adjustment.top
        //       });
        //     }
        //   });

    }
    if (page == 'place-edit') {
        api_url = "/place/place-get";
        var init_value = $('meta[name=init_value]').attr('content');
    }
    const div = "editor"
    let elements = [];
    elements = document.getElementsByClassName('editor');
    if (api_url == '') {
        return;
    }
    $.ajax({
        type: 'POST',
        url: api_url,
        data: {_token: $('#csrf-token').val()},
        dataType: 'html',
        success: function(data){
            for (let i = 0; i < elements.length; i++) {
                let value = 'Welcome';
                var rep = JSON.parse(data);
                const element = elements[i];
                if (rep != {} && rep[i]) {
                    value = rep[i].value;
                }
                let mde = new SimpleMDE({
                    autosave: {
                        enabled: false,
                        uniqueId: "MyUniqueID",
                        delay: 1000,
                    },
                    element: element,
                    forceSync: true,
                    initialValue: value,
                    status: false,
                    placeholder: "Type here...",
                    toolbar: ["bold", "italic",  "heading-2", "|",
                     {
                        name: "image",
                        action: function customFunction(editor){
                            // Add your own code
                            let cm = editor.codemirror;
                            activeIndex = i;
                            if ($('#picture_image')) {
                                $('#picture_image').attr('value','false');
                            }
                            $('#uploadModal').modal();
                        },
                        className: "fa fa-image",
                        title: "Image Button",
                    }, "preview" ],
                });
                mde.index = i;
                mde.page = page;
                window.mdes.push(mde);
            }
            if (page == 'track-edit' || page == 'place-edit') {
                var init_value = $('meta[name=init_value]').attr('content');
                let init_buffer = [];
                if (init_value) {
                    init_buffer= JSON.parse(init_value);
                    init_buffer.data = JSON.parse(init_buffer.data);
                    $('#edit-title').val(init_buffer.data.title);
                    $('#edit-description').val(init_buffer.data.title_text); 
                    window.mdes[0].value(init_buffer.data.description.value);
                    $('.editor-preview').html(init_buffer.data.description.html)
                    $('#edit-image').attr('src',init_buffer.data.image);
                }
            }
        }
    });
    
    window.setmdepicture =  (file) => {
        
        if ($('#picture_image') && $('#picture_image').val() == "true") {
            setEditImage(file);
            return;
        }
        if (activeIndex == -1) {
            return;
        }
        pos = window.mdes[activeIndex].codemirror.getCursor();
        window.mdes[activeIndex].codemirror.setSelection(pos, pos);
        const path = "![Image](" + file.path + ")";
        window.mdes[activeIndex].codemirror.replaceSelection(path);
        $('#uploadModal').modal('hide');
    }

    setEditImage =  (file) => {
        $('#edit-image').attr('src', file.path);
        $('#uploadModal').modal('hide');
    }

    $('#edit-image').on('click',function(event){
        $('#picture_image').attr('value',"true");
        $('#uploadModal').modal();
    })

    $('#AboutPageSave').on('click',function(event){
        window.mdes[0].togglePreview();
        let data = $('.editor-preview').html();
        let value = window.mdes[0].value();
        $.ajax({
            type: 'POST',
            url: "/about/save",
            data: {data: data, value: value, _token: $('#csrf-token').val()},
            dataType: 'html',
            success: function(data){
                // simplemde.togglePreview();
            }
        });
    })
    $('#onBoardSave').on('click',function(event){
        for (let i = 0; i < window.mdes.length; i++) {
            window.mdes[i].togglePreview();
        }
        let previews = document.getElementsByClassName('editor-preview')
        for (let i = 0; i < window.mdes.length; i++) {
            window.mdes[i].togglePreview();
            let data = previews[i].innerHTML;
            let value = window.mdes[i].value();
            $.ajax({
                type: 'POST',
                url: "/onboard/save",
                data: {id: i+1, data: data, value: value, _token: $('#csrf-token').val()},
                dataType: 'html',
                success: function(data){
                    // simplemde.togglePreview();
                }
            });
        }

        // window.mdes[activeIndex].togglePreview();
        // let data = $('.editor-preview').html();
        // let value = window.mdes[activeIndex].value();
        // console.log(data);
        // $.ajax({
        //     type: 'POST',
        //     url: "/about/save",
        //     data: {data: data, value: value, _token: $('#csrf-token').val()},
        //     dataType: 'html',
        //     success: function(data){
        //         console.log(data);
        //         // simplemde.togglePreview();
        //     }
        // });
    })
    $('#PlaceEditSave').on('click',function() {
        window.placeData = {
            position: [0, 0],
            title: '',
            image: '',
            description: {
                html: '',
                value: '',
            }
        }
        window.placeData.position  = [Markers[0].lat, Markers[0].lng];
        window.placeData.title = $('#edit-title').val();
        window.placeData.title_text = $('#edit-description').val(); 
        window.mdes[0].togglePreview();
        window.placeData.description= {
            html: $('.editor-preview').html(),
            value: window.mdes[0].value()
        }
        window.placeData.image = $('#edit-image').attr('src');
        let data = JSON.stringify(window.placeData);
        var init_value = $('meta[name=init_value]').attr('content');
        let _id = -1;
        if (init_value) {
            _id = JSON.parse(init_value).id;
        }
        $.ajax({
            type: 'POST',
            url: "/place/save",
            data: {id: _id, data: data, value: "", _token: $('#csrf-token').val()},
            dataType: 'html',
            success: function(data){
                window.location.replace('/admin/place');  
            }
        });
    });

    $('#TrackEditSave').on('click',function() {
        window.trackData.start  = [Markers[0].lat, Markers[0].lng];
        window.trackData.waypoints = [];
        for (let i = 1; i < Markers.length - 1; i++) {
            let cell = {
                lat: Markers[i].lat,
                lng: Markers[i].lng
            }
            window.trackData.waypoints.push(cell);
        }
        window.trackData.end  = [Markers[Markers.length-1].lat, Markers[Markers.length-1].lng];
        window.trackData.title = $('#edit-title').val();
        window.trackData.title_text = $('#edit-description').val(); 
        window.trackData.color = $('#colorSelector').attr('value');
        window.mdes[0].togglePreview();
        window.trackData.description= {
            html: $('.editor-preview').html(),
            value: window.mdes[0].value()
        }
        window.trackData.image = $('#edit-image').attr('src');
        console.log(window.trackData);
        let data = JSON.stringify(window.trackData);
        var init_value = $('meta[name=init_value]').attr('content');
        let _id = -1;
        if (init_value) {
            _id = JSON.parse(init_value).id;
        }
        $.ajax({
            type: 'POST',
            url: "/track/save",
            data: {id: _id, data: data, value: "", _token: $('#csrf-token').val()},
            dataType: 'html',
            success: function(data){
                window.location.replace('/admin/track');  
            }
        });
    });
    $('#addWayPoint').on('click',function() {
        if (Markers.length >= 10) {
            warningMessage('Nelze přidat nový bod', 2500, true);
            return;
        }
        AddTrackFlag = true;
        currentMap.setOptions({ draggableCursor: 'pointer' });
        warningMessage('Klepnutím na obrazovku přidáte nový bod, Dostupný: ' +  (10 - Markers.length), 1000 , false);
    });

});
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hodin, " : " hod, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " min, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay; 
}

function warningMessage(title, during, exit) {
    $('.gm-style-pbc').css('transition-duration', '0.3s');
    $('.gm-style-pbc').css('opacity', 1);
    $('.gm-style-pbt').html(title);
    if (exit) {
        setTimeout(()=> {
            $('.gm-style-pbc').css('transition-duration', '0.8s');
            $('.gm-style-pbc').css('opacity', 0);
        }, during)
    }
}

function addNewMarker(lat, lng) {
    let waypoints = [];
    for (let i = 0; i < Markers.length; i++) {
        let data = {
            lat: Markers[i].lat,
            lng: Markers[i].lng,
        }
        waypoints.push(data);
    }
    Markers.forEach((element) => {
        element.setMap(null);
    });
    let new_data = {
        lat: lat,
        lng: lng,
    }
    waypoints.push(new_data);
    Markers = [];
    console.log('!--------------------------------------');
    addMarkers(waypoints);
    DrawTrack();
}
function minMax(items) {
    return items.reduce((acc, val) => {
        acc[0] = ( acc[0] === undefined || val < acc[0] ) ? val : acc[0]
        acc[1] = ( acc[1] === undefined || val > acc[1] ) ? val : acc[1]
        return acc;
    }, []);
}

var currentMap = null;
var Markers = [];
let directionsService = null;
let geocoderService = null;
let AddTrackFlag = false;
var Routes = [];
var RoutesLatLng = [];
var Places = [];
var PlacesLatLng = [];
var mapZooming = true;

var polyLines = [];
$(document).ready(function() {
    setTimeout(()=>{
        directionsService = new google.maps.DirectionsService;
        geocoderService = new google.maps.Geocoder();
    },500);
    window.trackData = [];
    initMap();
});
function initMap() {
    if (!document.getElementById('map')) {
        return;
    }
    
    // The marker, positioned at Uluru
    setTimeout(() => {
        // The location of Uluru
        var location = {lat: 50.0770905, lng: 14.4301704};
        // The map, centered at Uluru
        currentMap = new google.maps.Map(
            document.getElementById('map'), {zoom: 16, center: location});
        google.maps.event.addListener(currentMap, "click", function (e) {
            if (AddTrackFlag) {
                currentMap.setOptions({ draggableCursor : "url(http://maps.google.com/mapfiles/openhand.cur), auto" })
                var latLng = e.latLng;
                addNewMarker(latLng.lat(), latLng.lng());
                $('.gm-style-pbc').css('transition-duration', '0.8s');
                $('.gm-style-pbc').css('opacity', 0);
                AddTrackFlag = false;
            }
        });
        const page = $("#page-name").val();
        if (page == 'track-edit') {
            initTrack();
            bonusByMarker();
        }
        if (page == 'place-edit') {
            initPlace();
        } 
    },1000);
    
}

$('#bonus-toggl').change(function() {
    mapZooming = $(this).prop('checked');
    if (mapZooming) {
        bonusByMarker();
    }
    console.log($(this).prop('checked'));
})

function bonusByMarker() {
    if (!mapZooming) {
        return;
    }
    var bounds = new google.maps.LatLngBounds();
    Markers.forEach((marker) => {
        let location = new google.maps.LatLng(marker.lat, marker.lng); 
        bounds.extend(location);
    })
    currentMap.fitBounds(bounds);
}
function initPlace() {
    let placeMarker = {
        lat: 50.0770905,
        lng: 14.4200704,
        label: 'P',
    }
    var init_value = $('meta[name=init_value]').attr('content');
    let init_buffer = [];
    if (init_value) {
        init_buffer= JSON.parse(init_value);
        init_buffer.data = JSON.parse(init_buffer.data);
        placeMarker.lat = init_buffer.data.position[0];
        placeMarker.lng = init_buffer.data.position[1];
    }
    addMarker(placeMarker);
    currentMap.setCenter(new google.maps.LatLng(Markers[0].lat, Markers[0].lng));
    Markers[0].addListener('dragend', getMarkerPosition);
    function getMarkerPosition(event) {
        Markers[0].lat = event.latLng.lat();
        Markers[0].lng = event.latLng.lng();
        currentMap.setCenter(new google.maps.LatLng(Markers[0].lat, Markers[0].lng));
    }
}
function addMarkers(points) {
    let letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i =0; i< points.length; i++) {
        let point = points[i];
        let marker = {
            lat: point.lat,
            lng: point.lng,
            label: letter[i],
        }
        addMarker(marker);
    }
}
function initTrack() {
    let markers = [];
    let startMarker = {
        lat: 50.0770905,
        lng: 14.4200704,
        label: 'A',
    }
    let endMarker = {
        lat: 50.0770905,
        lng: 14.4402704,
        label: 'B',
    }
    
   
    
    var init_value = $('meta[name=init_value]').attr('content');
    let init_buffer = [];
    if (init_value) {
        init_buffer= JSON.parse(init_value);
        init_buffer.data = JSON.parse(init_buffer.data);
        startMarker.lat = init_buffer.data.start[0];
        startMarker.lng = init_buffer.data.start[1];
        endMarker.lat = init_buffer.data.end[0];
        endMarker.lng = init_buffer.data.end[1];
        console.log(init_buffer.data.waypoints);
        // if (init_buffer.data.waypoints) {
        //     init_buffer.data.waypoints = JSON.parse(init_buffer.data.waypoints);
        // }
    }
    markers.push(startMarker);
    if (init_buffer != [] && init_buffer.data && init_buffer.data.waypoints) {
        init_buffer.data.waypoints.forEach((element) => {
            markers.push(element);
        })
    }
    markers.push(endMarker);
    console.log('!--------------------------------------');
    addMarkers(markers);
    
    // Markers[0].addListener('dragend', getMarkerAPosition);
    // Markers[1].addListener('dragend', getMarkerBPosition);
    DrawTrack();
    if (init_buffer == [] || init_buffer.data == undefined) {
        let data = {
            color :  "#3d87ff",
        }
        init_buffer.data = data;
    }
    $('#colorSelector').attr('value',init_buffer.data.color);
    $('#colorSelector div').css('backgroundColor', init_buffer.data.color);
    $('#colorSelector').ColorPicker({
        color: init_buffer.data.color,
        // flat: true,
        onShow: function (colpkr) {
          $(colpkr).fadeIn(500);
          return false;
        },
        onHide: function (colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        onChange: function (hsb, hex, rgb) {
          
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).attr('value', '#' + hex);
            $(el).ColorPickerHide();
            $('#colorSelector div').css('backgroundColor', '#' + hex);
            DrawTrack();
        },
      });
 
}
function DrawTrack() {
    for (let i=0; i< polyLines.length; i++) {
        polyLines[i].setMap(null);
    }
    polyLines = [];
    let trackDatas = [];
    let promises = [];

    for (let i = 0; i< Markers.length - 1; i++) {
        promises[i] = new Promise(function(resolve, reject) {
            let request = {
                origin: { lat: Markers[i].lat, lng: Markers[i].lng },
                destination: { lat: Markers[i + 1].lat, lng: Markers[i + 1].lng },
                travelMode: google.maps.TravelMode.WALKING,
                optimizeWaypoints : true,
            };
            for (let i = 0; i < RoutesLatLng.length; i++) {
                let element = RoutesLatLng[i];
                if (element.origin.lat == request.origin.lat &&
                    element.origin.lng == request.origin.lng &&
                    element.destination.lat == request.destination.lat &&
                    element.destination.lng == request.destination.lng) {
                        console.log('caches');
                        resolve(Routes[i]);
                        return;
                }
            }
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    let trackData = getRoute2MapData(response);
                    RoutesLatLng.push(request);
                    Routes.push(trackData);
                    console.log('request');
                    resolve(trackData);
                } else {
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!error');
                    console.log(response);
                    console.log(status);
                    resolve(null);
                }
            });
        });
    }

    Promise.all(promises).then(function(values) {
        values.forEach((element) => {
            if (element==null) {
                return;
            }
            trackDatas.push(element);
        })
        window.trackData = {
            start_address: '',
            end_address: '',
            distance: '',
            estimate: '',
            waypoint: [],
            paths: [],
            instructions: [],
        };
        if (trackDatas.length == 0) {
            return;
        }
        console.log(trackDatas)
        window.trackData.start_address = trackDatas[0].start_address;
        window.trackData.end_address = trackDatas[trackDatas.length - 1].end_address;
        let distance = 0;
        let estimate = 0;
        let waypoint = [];
        let paths = [];
        let instructions = [];
        let count = 0;
        for (let i = 0; i < trackDatas.length; i++) {
            let trackData = trackDatas[i];
            distance += trackData.distance_value;
            estimate += trackData.estimate_value;
            trackData.waypoint.forEach((element) => {
                waypoint.push(element);
            });
            trackData.paths.forEach((element) => {
                paths.push(element);
            })
            trackData.instructions.forEach((element) => {
                instructions.push(element);
            })
        }
        window.trackData.distance_value = distance;
        window.trackData.estimate_value = estimate;
        distance = distance / 1000;
        window.trackData.distance = distance.toFixed(2) + " km";
        window.trackData.estimate = secondsToHms(estimate);
        window.trackData.waypoint = waypoint;
        window.trackData.paths = paths;
        window.trackData.instructions = instructions;
        renderDirectionsPolylines(window.trackData);
        DrawTrackDataTable(window.trackData);
        DrawMarkDataTable(Markers, trackDatas);
        bonusByMarker();
    });
}
function getRoute2MapData(response) {
    let data = {
        start_address: '',
        end_address: '',
        distance: '',
        distance_value: 0, 
        estimate: '',
        estimate_value: 0,
        waypoint: [],
        paths: [],
        instructions: [],
    };
    let legs = response.routes[0].legs;
    for (let i = 0; i < legs.length; i++) {
        var steps = legs[i].steps;
        data.start_address = legs[0].start_address;
        data.end_address = legs[0].end_address;
        data.distance = legs[0].distance.text;
        data.distance_value = legs[0].distance.value;
        data.estimate = legs[0].duration.text;
        data.estimate_value = legs[0].duration.value;
        data.waypoint = [];
        data.paths = [];
        data.instructions = [];
        for (let j = 0; j < steps.length; j++) {
          var nextSegment = steps[j].path;
          data.waypoint.push([steps[j].end_location.lat(),steps[j].end_location.lng()]);
          data.paths.push(steps[j].path);
          let instruction = {
              distance: steps[j].distance,
              estimate: steps[j].duration,
              instruction: steps[j].instructions
          }
          data.instructions.push(instruction);
        }
      }
    return data;
}
function renderDirectionsPolylines(data) {
    let polylineOptions = {
        strokeColor: $('#colorSelector').attr('value'),
        strokeOpacity: 1,
        strokeWeight: 5
      };   
    var steps = data.paths;
    for (let j = 0; j < steps.length; j++) {
    var nextSegment = steps[j];
    var stepPolyline = new google.maps.Polyline(polylineOptions);
    for (let k = 0; k < nextSegment.length; k++) {
        stepPolyline.getPath().push(nextSegment[k]);
    }
    polyLines.push(stepPolyline);
    stepPolyline.setMap(currentMap);
    }
}
function DrawTrackDataTable(data) {
    let instructions = data.instructions;
    let innerString = "";
    innerString = '<tr>';
    innerString += '<td> Celková vzdálenost </td>'
    innerString += '<td>' + data.distance + '</td>'
    innerString += '<td>' + data.estimate + '</td>'
    innerString += '</tr>';
    instructions.forEach((element) => {
        let letter = '<tr>';
        letter += '<td>' + element.instruction + '</td>'
        letter += '<td>' + element.distance.text + '</td>'
        letter += '<td>' + element.estimate.text + '</td>'
        letter += '</tr>';
        innerString += letter;
    })
    $("#dataBody").html(innerString);
}

function getAddressFrom(lat, lng) {
     return new Promise(function(resolve, reject) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoderService.geocode({
        'latLng': latlng
        }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                resolve(results[1]);
            } else {
                resolve('Unnamed Address');
            }
        } else {
            resolve('Unnamed Address');
        }
        });
    });
    
  }

function DrawMarkDataTable(markers, tracks) {
    let promises = [];
    let innerString = null;
    // for (let i = 0; i < markers.length; i++) {
    //     promises[i] = new Promise(function(resolve, reject) {
    //         for (let j = 0; j < PlacesLatLng.length; j++) {
    //             let element = PlacesLatLng[j];
    //             if (element.lat == markers[i].lat && element.lng == markers[i].lng) {
    //                     console.log('place_caches');
    //                     resolve(Places[j]);
    //                     return;
    //             }
    //         }
    //         var latlng = new google.maps.LatLng(markers[i].lat, markers[i].lng);
    //         geocoderService.geocode({
    //         'latLng': latlng
    //         }, function (results, status) {
    //         if (status === google.maps.GeocoderStatus.OK) {
    //             if (results[1]) {
    //             console.log(results[1]);
    //                 let pos = {
    //                     lat: markers[i].lat,
    //                     lng: markers[i].lng,
    //                 }
    //                 PlacesLatLng.push(pos);
    //                 Places.push(results[1]);
    //                 resolve(results[1]);
    //             } else {
    //                 resolve('Unnamed Address');
    //             }
    //         } else {
    //             resolve('Unnamed Address');
    //         }
    //         });
    //     });
    // }

    // Promise.all(promises).then(function(values) {
    //     console.log(values);
    //     innerString = '';
    //     for (let i = 0; i < markers.length; i++) {
    //         let value = values[i];
    //         if (value.formatted_address != undefined) {
    //             value = value.formatted_address;
    //         }
    //         innerString += '<li>';
    //         innerString += '<img style="position: absolute;" src = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless2.png"/><span style ="position: absolute;    margin-left: 9px;">'
    //         innerString += markers[i].label; 
    //         innerString += '</span><span class="mark-table" value=' + i + ' style = "cursor:pointer; position: absolute;margin-left: calc(100% - 35px);">X</span> <div style =" padding-left: 40px; padding-right: 40px;">' +  value +'</div>';
    //         innerString += '';  
    //         innerString += '</li>';
    //     }
    //     $("#WayPointDataTable").html(innerString);
    //     $('.mark-table').on('click', function(event){
    //         RemoveMarker(event.toElement.getAttribute('value'));
    //     })
    // });
   
        innerString = '';
        for (let i = 0; i < markers.length; i++) {
            if (i == markers.length - 1) {
                value = tracks[i - 1].end_address;
            } else {
                value = tracks[i].start_address;
            }
            innerString += '<li>';
            innerString += '<img style="position: absolute;" src = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless2.png"/><span style ="position: absolute;    margin-left: 9px;">'
            innerString += markers[i].label; 
            innerString += '</span><span class="mark-table" value=' + i + ' style = "cursor:pointer; position: absolute;margin-left: calc(100% - 35px);">X</span> <div style =" padding-left: 40px; padding-right: 40px;">' +  value +'</div>';
            innerString += '';  
            innerString += '</li>';
        }
        $("#WayPointDataTable").html(innerString);
        $('.mark-table').on('click', function(event){
            RemoveMarker(event.toElement.getAttribute('value'));
        })
    
    
    
}
function RemoveMarker(index) {
    if (Markers.length == 2) {
        warningMessage('Nepodařilo se odstranit bod', 2500, true);
        return;
    }
    let waypoints = [];
    for (let i = 0; i < Markers.length; i++) {
        let data = {
            lat: Markers[i].lat,
            lng: Markers[i].lng,
        }
        if (i != index) {
            waypoints.push(data);
        }
    }
    Markers.forEach((element) => {
        element.setMap(null);
    });
    Markers = [];
    console.log('!--------------------------------------');
    addMarkers(waypoints);
    DrawTrack();
}

function addMarker(data) {
    const location = new google.maps.LatLng(data.lat,data.lng);
    // const icon = 'https://visualpharm.com/assets/587/Map Pin-595b40b65ba036ed117d2f6b.svg';
    // let image = {
    //     url:  icon,
    //     // size: new google.maps.Size(40, 48),
    //     // origin: new google.maps.Point(0, 0),
    //     // anchor: new google.maps.Point(40, 48),
    //     scaledSize: new google.maps.Size(30, 30),
    // };
    let marker = null;
    marker = new google.maps.Marker({
        map: currentMap,
        draggable: true,
        label: data.label,
        position: location,
        // icon: image,
    });
    marker.lat = data.lat;
    marker.lng = data.lng;
    marker.addListener('dragend',(event)=>{
        movePosition(event, marker)
    });
    marker.setMap(currentMap);
    Markers.push(marker);
}
function movePosition(event, marker) {
    let index = Markers.indexOf(marker);
    marker.lat = event.latLng.lat();
    marker.lng = event.latLng.lng();
    if (index != -1) {
        Markers[index] = marker;
    }
    DrawTrack();
}
