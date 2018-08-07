import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { navGLocation, routeData, markerData, currentTrack, currentRun, getDistanceFromLatLonInKm, userGLocation, env } from '../../providers/global';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-route',
	templateUrl: 'route.html',
})
// {
//     "start":  [34.695283, 135.4713031],
//     "end":  [34.678683, 135.4770731],
//     "color":"#ff00ff",
//     "title": "Název místa",
//     "title2": "Service: Excellent as always from Apple Store. Location: Super convenient location for",
//     "type": "info",
//     "name": "Stage01",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare sed magna vel posuere. Proin gravida, lacus vitae feugiat egestas, urna ligula lacinia libero, a iaculis lectus est non libero. Nullam ut sem ac mi tincidunt egestas eget quis purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce sed turpis egestas, vestibulum odio a, maximus ipsum. Pellentesque sollicitudin viverra convallis.",
//     "distance": 123,
//     "estimate": "45min",
//     "speed": "10km/h",
//     "image": "http://www.clker.com/cliparts/a/6/7/7/1195422531292378906valessiobrito_Japan_Woman_Black_and_White.svg.hi.png",
//     "extras": [
//         {
//             "image": "assets/imgs/img2.jpg",
//             "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare sed magna vel posuere. Proin gravida, lacus vitae feugiat egestas, urna ligula lacinia libero, a iaculis lectus est non libero. Nullam ut sem ac mi tincidunt egestas eget quis purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce sed turpis egestas, vestibulum odio a, maximus ipsum. Pellentesque sollicitudin viverra convallis."
//         },
//         {
//             "image": "assets/imgs/img2.jpg",
//             "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare sed magna vel posuere. Proin gravida, lacus vitae feugiat egestas, urna ligula lacinia libero, a iaculis lectus est non libero. Nullam ut sem ac mi tincidunt egestas eget quis purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce sed turpis egestas, vestibulum odio a, maximus ipsum. Pellentesque sollicitudin viverra convallis."
//         }
//     ]
//     },


export class RoutePage {
	tabBarElement: HTMLDivElement;
	data: any;
	title: any;
	distance: any;
	estimate: any;
	speed: any;
	image: any;
	image_profile: string = null;
	position: Array<any>;
	buttonTitle: any;
	routeData: Array<any>;
	markerData: Array<any>;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
	) {
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		if (navParams.data) {
			this.routeData = [];
			this.data = navParams.data.data;
			console.log(this.data);
			currentTrack.index = this.data.index;
			this.routeData.push(routeData[currentTrack.index]);
			this.markerData = markerData;
			console.log(this.data);
			this.title = this.data.title;
			this.distance = this.data.distance;
			this.estimate = this.data.estimate;
			this.speed = this.data.speed;
			this.image = this.data.image;
			this.image_profile = this.data.image_profile || null;

			this.position = this.data.start;
			navGLocation.lat = this.data.start[0];
			navGLocation.lng = this.data.start[1];
			this.buttonTitle = currentRun.status == 0 ? "Začít běh" : "Pokračovat";
			console.log(this.buttonTitle)
		} 
	}

	ionViewDidLoad() {
		$('#editor').html(this.data.description.html);
		console.log('ionViewDidLoad RoutePage');
	}

	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
	}

	ionViewWillLeave(): void {
		this.tabBarElement.style.display = 'flex';
	}

	open() {
		navGLocation.lat = this.data.start[0];
		navGLocation.lng = this.data.start[1];
		
		// if (currentRun.status != 0) {
		// 	this.presentConfirm();
		// 	return;
		// } else {
			// if (!env.debug) {
				if (getDistanceFromLatLonInKm(userGLocation.lat, userGLocation.lng, this.data.start[0],this.data.start[1]) > 0.03) {
					this.distanceConfirm();
					return;
				}
			// }
			currentRun.distance = 0;
			currentRun.time = 0;
			currentRun.prevPoint = currentRun.current;
			currentRun.status = 1;
			currentRun.start = [userGLocation.lat, userGLocation.lng];
			this.navCtrl.push('NavigationPage',{data:this.data});
		// }
	}
	back() {
		currentTrack.index = -1;
	}
	presentConfirm() {
		let alert = this.alertCtrl.create({
		  title: 'Confirm',
		  message: 'Do you contiuous running?',
		  buttons: [
			{
			  text: 'No, start new',
			  role: 'cancel',
			  handler: () => {
				currentRun.status = 0;
				currentRun.distance = 0;
				currentRun.time = 0;
				currentRun.start = [0, 0];
				currentRun.prevPoint = currentRun.current;
				// if (getDistanceFromLatLonInKm(userGLocation.lat, userGLocation.lng, this.data.start[0],this.data.start[1]) > 0.01) {
				// 	this.distanceConfirm();
				// 	return;
				// }
				currentRun.prevPoint = currentRun.current;
				currentRun.status = 1;
				currentRun.start = [userGLocation.lat, userGLocation.lng];
				this.navCtrl.push('NavigationPage',{data:this.data});
				console.log('Cancel clicked');
			  }
			},
			{
			  text: 'Yes, go',
			  handler: () => {
				console.log('Buy clicked');
				currentRun.status = 1;
				this.navCtrl.push('NavigationPage',{data:this.data});
			  }
			}
		  ]
		});
		alert.present();
	  }
	  distanceConfirm() {
		let alert = this.alertCtrl.create({
		  title: 'Než začnete běh...',
		  message: 'Pro začátek běhu musíte být nejvíce 30 m od počátečního bodu',
		  buttons: [
			{
			  text: 'OK',
			  role: 'ok',
			  handler: () => {
				console.log('Cancel clicked');
			  }
			}
		  ]
		});
		alert.present();
	  }

}
