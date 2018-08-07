import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { userGLocation, getDistanceFromLatLonInKm, env, markerData } from '../../providers/global';
import { secondsToHms } from '../../providers/time-service';
declare let google: any;

@IonicPage()
@Component({
	selector: 'page-places',
	templateUrl: 'places.html',
})
export class PlacesPage {
	buffers: Array<any>;
	items: Array<any>;
	show: any;
	scroll_show: any;
	count: any;
	promiseAll: Array<any>;
	directionsService = new google.maps.DirectionsService;
	constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private platform: Platform) {
		let self = this;
		this.buffers = [];
		this.items = [];
		this.count = 0;
		this.show = false;
		this.scroll_show = true;
		this.promiseAll = [];
		platform.ready().then(() => {
			// this.http.get('assets/json/data.json').map(res => res.json()).subscribe(data => {
			let data = [...markerData];
			console.log(data);
			self.count = data.length;
			self.buffers = data;
			for (let i = 0; i < data.length; i++) {
					let promise = null;
					if(env.mode == 1) {
						promise = new Promise((resolve, reject) => {
							let item = data[i];
							let startLocation = new google.maps.LatLng(userGLocation.lat,userGLocation.lng);
							let endLocation = new google.maps.LatLng(item.position[0],item.position[1]);
							let self = this;
							// 10.616938, 103.541508
							let request = {
								origin: startLocation,
								destination: endLocation,
								optimizeWaypoints: true,
								travelMode: google.maps.TravelMode.WALKING
							};
							console.log(request);
							self.directionsService.route(request, function (response, status) {
								if (status == google.maps.DirectionsStatus.OK) {
									console.log(response);
									let value = {
										distance: response.routes[0].legs[0].distance.value,
										distanceString: response.routes[0].legs[0].distance.text,
										estimate: response.routes[0].legs[0].duration.value,
										estimateString: response.routes[0].legs[0].duration.text
									}
									resolve(value);
								}
								function pushNavigate() {
									console.log('OK');
								}
							});
						})
						self.promiseAll.push(promise);
					} else {
						let item = data[i];
						self.buffers[i].distance = getDistanceFromLatLonInKm(userGLocation.lat,userGLocation.lng,item.position[0],item.position[1]);
						self.buffers[i].estimate = secondsToHms(getDistanceFromLatLonInKm(userGLocation.lat,userGLocation.lng,item.position[0],item.position[1]) * 1000 / env.speed);
					}
			}
			if(env.mode == 1) {
				Promise.all(self.promiseAll).then(function(values) {
					console.log(values);
					console.log(self.buffers[0].distance);
					for (let i = 0; i < self.buffers.length; i++) {
						self.buffers[i].distance = values[i].distance; 
						self.buffers[i].distanceString = values[i].distanceString; 
						self.buffers[i].estimate = values[i].estimate; 
						self.buffers[i].estimateString = values[i].estimateString; 
					}
					self.show = true;
					for (let i = 0; i< self.buffers.length; i++) {
						for(let j = 0; j< self.buffers.length; j++) {
							if(self.buffers[i].distance < self.buffers[j].distance) {
								self.buffers[j] = [self.buffers[i], self.buffers[i] = self.buffers[j]][0];
							}
						}
					}
					console.log(self.buffers[0]);
					for(let i = 0; i < 5; i++) {
						if(self.buffers[0] != null) {
							self.buffers[0].distance =  self.buffers[0].distanceString;
							self.items.push(self.buffers[0]);
							self.buffers.shift();
						} else {
							self.scroll_show = false;
						}
					}
				});
			} else {
				self.show = true;
				for (let i = 0; i< self.buffers.length; i++) {
					for(let j = 0; j< self.buffers.length; j++) {
						if(self.buffers[i].distance < self.buffers[j].distance) {
							self.buffers[j] = [self.buffers[i], self.buffers[i] = self.buffers[j]][0];
						}
					}
				}
				console.log(self.buffers);
				for(let i = 0; i < 5; i++) {
					if(self.buffers[0] != null) {
						self.buffers[0].distance =   String(Math.round(self.buffers[0].distance*100)/100) + ' km';
						self.items.push(self.buffers[0]);
						self.buffers.shift();
					} else {
						self.scroll_show = false;
					}
				}
			}
			// });
		});		
	}
	doInfinite(infiniteScroll) {
		console.log('Begin async operation');
		let self = this;
		setTimeout(() => {
		  console.log('Async operation has ended');
		  	for(let i = 0; i < 5; i++) {
				if(this.buffers[0] != null) {
					self.buffers[0].distance =  Math.round(self.buffers[0].distance*100)/100 + ' km';
					this.items.push(this.buffers[0]);
					this.buffers.shift();
				} else {
					self.scroll_show = false;
				}
			}
		  infiniteScroll.complete();
		}, 500);
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad PlacesPage');
	}
	open(data) {
		data.intro = 'routes';
		this.navCtrl.push('PlacePage',{data});
	}

}
