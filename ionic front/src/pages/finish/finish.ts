import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { currentRun, userGLocation, currentTrack } from '../../providers/global';
import {  seconds2Hms } from '../../providers/time-service';

@IonicPage()
@Component({
	selector: 'page-finish',
	templateUrl: 'finish.html',
})
export class FinishPage {
	tabBarElement: HTMLDivElement;
	distance: any;
	time: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		this.time = seconds2Hms(currentRun.time);
		this.distance =   String(Math.round(currentRun.distance*100)/100) + ' km';
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FinishPage');
	}

	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
	}

	ionViewWillLeave(): void {
		this.tabBarElement.style.display = 'flex';
	}

	close() {
		currentRun.time = 0;
		currentRun.distance = 0;
		currentRun.status = 0;
		currentRun.start = [0,0];
		currentRun.prevPoint = [0,0];
		currentRun.current = [userGLocation.lat,userGLocation.lng];
		currentRun.showRunning = 0;
		currentTrack.index = -1;
		this.navCtrl.push('RoutesPage');
	}
}
