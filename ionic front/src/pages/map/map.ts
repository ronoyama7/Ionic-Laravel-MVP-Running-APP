import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { userGLocation, navGLocation, currentTrack, routeData, markerData } from '../../providers/global';

@IonicPage()
@Component({
	selector: 'page-map',
	templateUrl: 'map.html',
})
export class MapPage {
	routeData: any;
	markerData: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events) {
		currentTrack.index = -1;
		console.log(routeData);
		console.log(markerData);
		this.routeData = routeData;
		this.markerData = markerData;
		if (navGLocation.lat == 0) {
			navGLocation.lat = 50.0770905;
			navGLocation.lng = 14.4301704;
		}
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad MapPage');
		currentTrack.index = -1;
	}
	gotoMe() {
		this.events.publish('gotome',true);
	}
	movement(handle) {
		if (handle == 'up') {
			userGLocation.lat +=0.00003;
			this.events.publish('movement',true);
		}
		if (handle == 'down') {
			userGLocation.lat -=0.00003;
			this.events.publish('movement',true);
		}
		if (handle == 'left') {
			userGLocation.lng -=0.00003;
			this.events.publish('movement',true);
		}
		if (handle == 'right') {
			userGLocation.lng +=0.00003;
			this.events.publish('movement',true);
		}
	}

}
