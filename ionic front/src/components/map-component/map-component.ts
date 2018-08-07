import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, Events, Platform, ToastController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage} from "@ionic/storage";
import * as $ from 'jquery';

import { userGLocation, navGLocation, calculateDistance, currentTrack, env, getDistanceFromLatLonInKm, currentRun,  markerData, routeData } from '../../providers/global';
import { secondsToHms } from '../../providers/time-service';


declare let google: any;
@Component({
	selector: 'map-component',
	templateUrl: 'map-component.html'
})
export class MapComponent {
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('panel') panelElement: ElementRef;
    @Input() routeData: any;
    @Input() markerData: any;
	@Input() mapType: any;
	@Input() mapUsing: any;
    @Input() zoom: any;
	@Input() trackFlag: any;
	@Input() UILockFlag: any;
	@Input() FitBoundFlag: any;
    map: any;
    markers: Array<any>;
    userMarker: any;
    trackMarker: any;
    trackLines: Array<any>;
	trackPreNearPosition: Array<any>;
	prestartIndex: any;
	poly: any;
	timer: any;
    constructor (
        public navCtrl: NavController,
		private events: Events,
		private platform: Platform,
    ) {
		let self = this;
		this.markers = [];
		this.userMarker = null;
		this.trackMarker = null;
		this.trackLines = [];
		this.trackPreNearPosition = [];
		this.prestartIndex = -1;
		platform.ready().then(() => {
			self.events.subscribe('gotome',function(data){
				self.trackFlag = false;
				const DesLocation = new google.maps.LatLng(userGLocation.lat,userGLocation.lng);
				self.map.panTo(DesLocation);
				self.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
				if (self.userMarker) {
					self.userMarker.setPosition(DesLocation);
				}
			});
			self.events.subscribe('navgoto',function(data){
				self.trackFlag = false;
				if ( navGLocation.lat != 0 ) {
					const navDest = new google.maps.LatLng(navGLocation.lat,navGLocation.lng);
					self.map.panTo(navDest);
					self.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
					setTimeout(()=>{
						navGLocation.lat = navGLocation.lng = 0;
					},1000)
				} 
			});
			self.events.subscribe('geolocation',function(data){
				calculateDistance();
				if (currentTrack.index != -1 &&  self.FitBoundFlag == false) {
					self.renderRouteByTracking(routeData[currentTrack.index]);
				}
				if (self.trackFlag) {
					const DesLocation = new google.maps.LatLng(userGLocation.lat,userGLocation.lng);
					self.map.panTo(DesLocation);
					self.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
				}
				const DesLocation = new google.maps.LatLng(userGLocation.lat,userGLocation.lng);
				if (self.userMarker) {
					self.userMarker.setPosition(DesLocation);
				}
				
			});
		});
	}

	ngOnInit() {
		this.platform.ready().then(() => {
			if (this.mapType == 'user') {
				
				this.initMap(userGLocation.lat, userGLocation.lng);
				this.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
			} else {
				this.trackFlag = false;
				
				this.initMap(navGLocation.lat, navGLocation.lng);
				this.GetOnCzechFromLatLng(navGLocation.lat, navGLocation.lng);
			}
		});
	}

	ionViewDidLoad() {
		console.log(this.routeData);
	}

	GetOnCzechFromLatLng(lat, lng) {
		const point1 = [51.047899, 11.950708];
		const point2 = [48.686304, 18.960024];
		if (lat > point2[0] && lat < point1[0] && lng > point1[1] && lng < point2[1]) {
			// in czech
			return true;
		} else {
			
			var strictBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(50.047899, 12.950708),
				new google.maps.LatLng(49.686304, 17.960024) 
			);
			this.map.fitBounds(strictBounds);
			return false;
		}
	}

    initMap(lat, lng) {
        
 		let self = this;
		this.map = new google.maps.Map(this.mapElement.nativeElement, {
			zoom: this.zoom,
		    disableDefaultUI: this.UILockFlag,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: {lat , lng}
		});
		
		google.maps.event.addListenerOnce(this.map , 'idle', function(){
			//loaded fully
			self.timer = setInterval(()=> {
				let transfer = false;
				for (var i = 0; i < $('#markerLayer')[0].children.length; i++) {
					if ($('#markerLayer')[0].children[i].children[0].getAttribute('src') == "https://maps.gstatic.com/mapfiles/transparent.png") {
						transfer = true;
					}
					if ( $('#markerLayer')[0].children[i].children[0].getAttribute('src') != null
					&&	$('#markerLayer')[0].children[i].children[0].getAttribute('src') != 'https://www.lacremacoffeecompany.com/wp-content/uploads/2017/02/Map-Marker-Flag-Right-Pink.png'
					&& $('#markerLayer')[0].children[i].children[0].getAttribute('src') !=  'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Flag-4-Right-Chartreuse-icon.png'
					&& $('#markerLayer')[0].children[i].children[0].getAttribute('src') !=  'assets/imgs/icon-user.png'
					) {
						$('#markerLayer')[0].children[i].children[0].className = 'border_radius';
					} else {
						$('#markerLayer')[0].children[i].children[0].className = 'nonborder_radius';
					}
				}
				console.log(transfer);
				if (transfer == false) {
					clearInterval(self.timer);
					setTimeout(()=>{
						$('#markerLayer').attr('class','show_layer');
					},1000)
					console.log("ok")
				}
			}, 800); 	
		});

		this.markerData.forEach(function(data) {
			console.log(data);
			self.addCustomMarker(data);

		});

		var myoverlay = new google.maps.OverlayView();
		myoverlay.draw = function () {
			this.getPanes().markerLayer.id='markerLayer';
		};
		myoverlay.setMap(this.map);
		setTimeout(()=>{
			$('#markerLayer').attr('class','hide_layer');
		},100);


		


        this.routeData.forEach(function(data) {
            self.addRoute(data);
		});


		if (userGLocation.lat != 0) {  
			let MyLocation = new google.maps.LatLng(userGLocation.lat, userGLocation.lng);
			this.addUserMarker(MyLocation,"assets/imgs/icon-user.png");
		}
		for (let i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(self.map);
		}
		
		if (self.FitBoundFlag) {
			let bounds = new google.maps.LatLngBounds();
			let start = new google.maps.LatLng(this.routeData[0].start[0], this.routeData[0].start[1]);
			let end = new google.maps.LatLng(this.routeData[0].end[0], this.routeData[0].end[1]);
			
			bounds.extend(start);
			if (this.routeData[0].waypoints) {
				this.routeData[0].waypoints.forEach((element) => {
					let pos = new google.maps.LatLng(element.lat, element.lng);
					bounds.extend(pos);
				});
			}
			bounds.extend(end);
			self.map.fitBounds(bounds);
			self.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
		} else {
			if (currentTrack.index != -1) {
				setTimeout(()=> {
					self.renderRouteByTracking(routeData[currentTrack.index]);
				},100)
			}
		}
		if (this.mapUsing == "map") {
			setTimeout(()=>{
				let buffer = [];
				let userLocation = [userGLocation.lat,userGLocation.lng];
				buffer.push(userLocation);
				for (let i = 0; i < routeData.length; i++) {
					let location1 = [routeData[i].start[0],routeData[i].start[1]];
					let location2 = [routeData[i].end[0],routeData[i].end[1]];
					buffer.push(location1);
					buffer.push(location2);
				}
				for (let i = 0; i < markerData.length; i++) {
					let location = [markerData[i].position[0],markerData[i].position[1]];
					buffer.push(location);
				}
				let lat_min = 99999999;
				let lat_max = 0;
				let lng_min = 99999999;
				let lng_max = 0;
				for (let i = 0; i< buffer.length; i++) {
					if (buffer[i][0] > lat_max) {
						lat_max = buffer[i][0];
					}
					if (buffer[i][1] > lng_max) {
						lng_max = buffer[i][1];
					}
					if (buffer[i][0] < lat_min) {
						lat_min = buffer[i][0];
					}
					if (buffer[i][1] < lng_min) {
						lng_min = buffer[i][1];
					}
				}
				let bounds = new google.maps.LatLngBounds();
				let point1 = new google.maps.LatLng(lat_max,lng_max);
				let point2 = new google.maps.LatLng(lat_max,lng_min);
				let point3 = new google.maps.LatLng(lat_min,lng_max);
				let point4 = new google.maps.LatLng(lat_min,lng_min);
				bounds.extend(point1);
				bounds.extend(point2);
				bounds.extend(point3);
				bounds.extend(point4);
				self.map.fitBounds(bounds);
				self.GetOnCzechFromLatLng(userGLocation.lat, userGLocation.lng);
			}, 500);
		}

		// this.poly = new google.maps.Polyline({
		// 	strokeColor: '#000000',
		// 	strokeOpacity: 1.0,
		// 	strokeWeight: 3
		// });
		// this.poly.setMap(this.map);
		// this.map.addListener('click', (event) => {
		// 	console.log('path add0');
		// 	var path = this.poly.getPath();
        // 	path.push(event.latLng);
		// 	var marker = new google.maps.Marker({
		// 		position: event.latLng,
		// 		title: '#' + path.getLength(),
		// 		map: this.map
		// 	});
		// 	console.log(path);
		// 	let rslt = this.poly.getPath().getArray().map(p => {
		// 		return {
		// 			lat: p.lat(),
		// 			lng: p.lng(),
		// 		}
		// 	});

		// 	let instructions = [];
		// 	if(rslt.length >= 2) {
		// 		for(let i = 0; i < rslt.length - 1; i++) {
		// 			let distance = getDistanceFromLatLonInKm(rslt[i].lat, rslt[i].lng, rslt[i+1].lat, rslt[i+1].lng) * 1000;
		// 			instructions.push({
		// 				distance: {
		// 					text: (distance < 100 ? (distance + ' m') : ((distance/1000) + ' km')), 
		// 					value: Math.round(distance)
		// 				},
		// 				estimate: {
		// 					text: "1 min.", 
		// 					value: 60
		// 				},
		// 				instruction: 'step_' + i
		// 			})
		// 		}
		// 	}
		// 	console.log(instructions);
		// 	console.log(JSON.stringify(rslt));

		// });
		// this.poly = new google.maps.Polyline({
		// 	strokeColor: '#000000',
		// 	strokeOpacity: 1.0,
		// 	strokeWeight: 3
		// });
		// this.poly.setMap(this.map);
		// this.map.addListener('click', (event) => {
		// 	console.log('path add0');
		// 	var path = this.poly.getPath();
        // 	path.push(event.latLng);
		// 	var marker = new google.maps.Marker({
		// 		position: event.latLng,
		// 		title: '#' + path.getLength(),
		// 		map: this.map
		// 	});
		// 	console.log(path);
		// 	let rslt = this.poly.getPath().getArray().map(p => {
		// 		return {
		// 			lat: p.lat(),
		// 			lng: p.lng(),
		// 		}
		// 	});
		// 	console.log(rslt)
		// 	console.log(JSON.stringify(rslt));
		// 	console.log(rslt.toString());

		// });

    }

    addRoute(data) {
		let self = this;
        self.renderDirectionsPolylines(data);
        let mdata = {
            routeData: data,
            position: [data.start[0],data.start[1]],
            type: 'start'
        }
        self.addCustomMarker(mdata);
        mdata = {
            routeData: data,
            position: [data.end[0],data.end[1]],
            type: 'end'
        }
        self.addCustomMarker(mdata);
	}
    addUserMarker(location, imageUrl) {
		let self = this;
		if (imageUrl == '') {
			self.userMarker = new google.maps.Marker({
				draggable: false,
				map: this.map,
				animation: google.maps.Animation.DROP,
				position: location,
			});
		} else {
			let image = {
				url:  imageUrl,
				scaledSize: new google.maps.Size(52, 52),
			};
			self.userMarker = new google.maps.Marker({
				map: this.map,
				draggable: false,
				animation: google.maps.Animation.DROP,
				position: location,
				icon: image,
			});
		}
		self.userMarker.setMap(self.map);
		this.markers.push(self.userMarker);
	}
    addCustomMarker(data) {
		let self = this;
		const location = new google.maps.LatLng(data.position[0],data.position[1]);
		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
			parking: {
				icon: iconBase + 'parking_lot_maps.png'
			},
			library: {
				icon: iconBase + 'library_maps.png'
			},
			info: {
				icon: iconBase + 'info-i_maps.png'
			},
			pin: {
				icon: 'https://visualpharm.com/assets/587/Map Pin-595b40b65ba036ed117d2f6b.svg'
			},
			start: {
				icon: 'https://www.lacremacoffeecompany.com/wp-content/uploads/2017/02/Map-Marker-Flag-Right-Pink.png'
			},
			end: {
				icon: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Flag-4-Right-Chartreuse-icon.png'
			}
		};
		let imageUrl = icons[data.type].icon;
		if (data.type == 'parking') {
			imageUrl = data.image;
		}
		console.log
		let image = {
			url:  imageUrl,
			scaledSize: new google.maps.Size(30, 30),
		};
		const marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: location,
			icon: image,
			optimized: false
		});
		if (data.type == 'pin') {
			return;
		}
		if (data.type == 'start' || data.type == 'end') {
			marker.addListener('click', openRouteDetail);
			return;
		} else {
			marker.addListener('click', openPlaceDetail);
		}
		function openRouteDetail() {
			let routeData = data.routeData;
			if (currentTrack.index != -1) {
				return;
			}
			self.navCtrl.push('RoutePage',{data: routeData[currentTrack.index]});
		}
		function openPlaceDetail() {
			let origin1 = {
				lat: userGLocation.lat,
				lng: userGLocation.lng
			}
			var destination = {
				lat: data.position[0],
				lng: data.position[1]
			};
			data.distance = String(Math.round(getDistanceFromLatLonInKm(origin1.lat,origin1.lng,destination.lat,destination.lng)*100)/100) + ' km';
			data.estimate = secondsToHms(getDistanceFromLatLonInKm(origin1.lat,origin1.lng,destination.lat,destination.lng) * 1000 / env.speed);
			data.intro = 'map';
			self.navCtrl.push('PlacePage',{data});
        }
		this.markers.push(marker);
		

    }
    
    renderDirectionsPolylines(data) {
		// console.log('polylines', data);
		// data.waypoint
		// 	.forEach((wp, index) => {
		// 		console.log('wp', wp, index);
		// 		console.log(data.instructions[index + 1]);
		// 		let marker = new google.maps.Marker({
		// 			map: this.map,
		// 			//title: 'wp: ' + index,
		// 			title: ('wp: ' + index) + '; ' + ((!!data.instructions[index + 1]) ? data.instructions[index + 1].instruction : 'konec'),
		// 			//position: new google.maps.LatLng(wp.lat,wp.lng)
		// 			position: new google.maps.LatLng(wp[0],wp[1])
		// 		});
		// 		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
		// 	})
		let self = this;
		let polylineOptions = {
			strokeColor: data.color,
			strokeOpacity: 0.8,
			strokeWeight: 5.5
		  };
		let polylines = [];
		for (let i=0; i< polylines.length; i++) {
			polylines[i].setMap(null);
		}
		var steps = data.paths;
        for (let j = 0; j < steps.length; j++) { 
			var nextSegment = steps[j];
			
			var stepPolyline = new google.maps.Polyline(polylineOptions);
			for (let k = 0; k < nextSegment.length; k++) {
				const Segment = new google.maps.LatLng(nextSegment[k].lat,nextSegment[k].lng);
				stepPolyline.getPath().push(Segment);
			}
			polylines.push(stepPolyline);
			stepPolyline.setMap(self.map);

			// new google.maps.Marker({
			// 	map: this.map,
			// 	title: 'mark: ' + j,
			// 	position: new google.maps.LatLng(nextSegment[0].lat,nextSegment[0].lng)
			// });

			// route click listeners, different one on each step
			google.maps.event.addListener(stepPolyline, 'click', function(evt) {
				if (currentTrack.index != -1) {
					return;
				}
				self.navCtrl.push('RoutePage',{data});
			})
		}
      }
      
      renderRouteByTracking(data) {
		let waypoint = data.waypoint;
		let paths = data.paths;
		let instructions = data.instructions;
		let polylineOptions = {
			strokeColor: data.color,
			strokeOpacity: 1,
			strokeWeight: 6.5
		};
		let startIndex = 0;
		let distances = [];
		for (let i = 0; i< waypoint.length; i++) {
			let distance = getDistanceFromLatLonInKm(userGLocation.lat,userGLocation.lng,waypoint[i][0],waypoint[i][1]);
			distances[i] = distance;
		}

		let min_distance = Math.min(...distances);
		startIndex = distances.indexOf(min_distance);

		if (startIndex + 1 == waypoint.length && min_distance < 0.01) {
			if (startIndex - this.prestartIndex == 1) {
				if (currentRun.status != 5) {
					currentRun.status = 5;
					this.events.publish('finish',true);
					this.prestartIndex = -1;
				}
			}
			return;
		}
		console.log('point: ' + this.prestartIndex);
		console.log('point: ' + startIndex);

		if (min_distance < 0.01 && this.prestartIndex != startIndex && startIndex - this.prestartIndex == 1 ||
			 this.prestartIndex == -1 || (min_distance < 0.01 && this.prestartIndex == 0 && startIndex == 0)) {
			if (startIndex + 1 == waypoint.length) {
				startIndex--;
			}
			if (this.prestartIndex == -1) {
				this.prestartIndex = 0;
				let waypointStep = {
					position: [waypoint[0][0],waypoint[0][1]]
				}
				this.addTrackMarker(waypointStep);
				this.events.publish('instructions',instructions[0]);
			} else {
				this.prestartIndex = startIndex;
				let waypointStep = {
					position: [waypoint[startIndex+1][0],waypoint[startIndex+1][1]]
				}
				this.addTrackMarker(waypointStep);
				this.events.publish('instructions',instructions[startIndex+1]);
			}
		}

		for (let i = 0; i < this.trackLines.length; i++) {
			this.trackLines[i].setMap(null);
		}
		this.trackLines = [];
		for (let i = (this.prestartIndex == -1 ? 0: this.prestartIndex); i < this.prestartIndex + 2; i++) {
			let stepPolyline = new google.maps.Polyline(polylineOptions);
			let nextSegment = paths[i];
			if (nextSegment == undefined) {
				return;
			}
			for (let j = 0; j < nextSegment.length; j++) {
				const Segment = new google.maps.LatLng(nextSegment[j].lat,nextSegment[j].lng);
				stepPolyline.getPath().push(Segment);
			}
			this.trackLines.push(stepPolyline);
			stepPolyline.setMap(this.map);
		}
    }
    
    addTrackMarker(data) {
		let self = this;
		const location = new google.maps.LatLng(data.position[0],data.position[1]);
		const icon = 'https://visualpharm.com/assets/587/Map Pin-595b40b65ba036ed117d2f6b.svg';
		let image = {
			url:  icon,
			scaledSize: new google.maps.Size(30, 30),
		};
		if (this.trackMarker) {
			this.trackMarker.setMap(null);
		}
		this.trackMarker = null;
		this.trackMarker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.BOUNCE,
			position: location,
			icon: image,
		});
		this.trackMarker.setMap(this.map);
	}
}