import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage} from "@ionic/storage";
import { navGLocation, userGLocation, currentRun, currentTrack } from '../../providers/global';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-place',
	templateUrl: 'place.html',
})
export class PlacePage {
	tabBarElement: HTMLDivElement;
	data: any;
	distance: any;
	title: any;
	image: any;
	position: Array<any>;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private events: Events,
		private storage : Storage,
	) {
		if (navParams.data) {
			this.data = navParams.data.data;
			console.log(this.data);
			this.distance = this.data.distance;
			this.title = this.data.title;
			this.image = this.data.image;
			this.position = this.data.position;
		}
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
	}

	ionViewDidLoad() {
		console.log(this.data.description.html);
		$('#editor').html(this.data.description.html);
		$('.wysiwyg').html(this.data.description.html);
		console.log('ionViewDidLoad PlacePage');
	}

	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
	}

	ionViewWillLeave(): void {
		this.tabBarElement.style.display = 'flex';
	}

	open() {
		this.data.start = [userGLocation.lat, userGLocation.lng];
		console.log(this.position)
		navGLocation.lat = this.position[0];
		navGLocation.lng = this.position[1];
		setTimeout(()=>{this.events.publish('navgoto',navGLocation);},500);
		if (this.data.intro == 'map') {
			this.navCtrl.pop();
		} else {
			this.navCtrl.popToRoot();
			this.navCtrl.parent.select(1);
		}
		
	}

}
