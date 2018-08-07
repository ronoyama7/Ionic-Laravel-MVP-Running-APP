import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { userGLocation, getDistanceFromLatLonInKm, env, routeData } from '../../providers/global';
import { secondsToHms } from '../../providers/time-service';
import { LocationTrackerProvider } from '../../providers/location-tracker';
// import { getRoute, getRoute2MapData } from '../../providers/google-service';

declare let google: any;

@IonicPage()
@Component({
	selector: 'page-routes',
	templateUrl: 'routes.html',
})
export class RoutesPage {
	buffers: Array<any>;
	items: Array<any>;
	show: any;
	count: any;
	scroll_show: any;
	promiseAll: Array<any>;
	directionsService = new google.maps.DirectionsService;
	constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private platform: Platform, private location: LocationTrackerProvider) {
		let self = this;
		this.buffers = [];
		this.items = [];
		this.count = 0;
		this.scroll_show = true;
		this.show = false;
		this.promiseAll = [];
		platform.ready().then(() => {
			// this.http.get('assets/json/route.json').map(res => res.json()).subscribe(data => {
			// routeData.map((data) => {	
			let data = [...routeData];
			console.log(data);
			self.count = data.length;
			self.buffers = data;
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				console.log(item);
				self.buffers[i].distance = item.distance;
				self.buffers[i].distance_value = item.distance_value;
				self.buffers[i].estimate = item.estimate;
				self.buffers[i].estimate_value = item.estimate_value;
				self.buffers[i].userDistance = getDistanceFromLatLonInKm(item.start[0], item.start[1], userGLocation.lat, userGLocation.lng).toFixed(2).toString()+"km";
				console.log(self.buffers[i].userDistance);
			}
			self.show = true;
			for (let i = 0; i< self.buffers.length; i++) {
				for(let j = 0; j< self.buffers.length; j++) {
					if(self.buffers[i].distance_value < self.buffers[j].distance_value) {
						self.buffers[j] = [self.buffers[i], self.buffers[i] = self.buffers[j]][0];
					}
				}
			}
			console.log(self.buffers);
			for(let i = 0; i < 5; i++) {
				if(self.buffers[0] != null) {
					self.items.push(self.buffers[0]);
					self.buffers.shift();
				} else {
					self.scroll_show = false;
				}
			}
		});
		// });		
	}
	doInfinite(infiniteScroll) {
		let self = this;
		console.log('Begin async operation');
		setTimeout(() => {
		  console.log('Async operation has ended');
		  	for(let i = 0; i < 5; i++) {
				if (this.buffers[0] != null) {
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
		console.log('ionViewDidLoad RoutesPage');
		routeData.forEach(function(data) {
			if (data.saved == undefined) {
				// getRoute(data.start[0], data.start[1], data.end[0], data.end[1]).then((result) => {
				// getRoute2MapData(result,data);
				// console.log(data);
				// }).catch((err) => {
				// console.log(err);
				// })
			}
		});
	}

	open(data) {
		this.navCtrl.push('RoutePage',{data});
	}

}
