import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, ToastController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeAudio } from '@ionic-native/native-audio';
import { LocationTrackerProvider } from '../../providers/location-tracker';
import { navGLocation, routeData, markerData, currentTrack, currentRun, getDistanceFromLatLonInKm, userGLocation, gpsStatus } from '../../providers/global';
import { startTimeRecord, currentTimeRecord, pauseTimeRecord, resumeTimeRecord, seconds2Hms } from '../../providers/time-service';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-navigation',
	templateUrl: 'navigation.html',
})
export class NavigationPage {
	tabBarElement: HTMLDivElement;
	data : Array<any>;
	time: any;
	status: any;
	distance: any;
	timer: any;
	instructions_dir: any;
	instructions_dis: any;
	enableAudio: any;
	gpsStatus: any;
	gpsStatusImage: any;
	gpsStatusTitle: any;
	routeData: any;
	markerData: any;
	TextShow: any;
	pre_letters: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private locationTrackerProvider: LocationTrackerProvider,
		private event: Events,
		private platform: Platform,
		private tts: TextToSpeech,
		private nativeAudio: NativeAudio,
		private toastCtrl: ToastController,
	) {
		platform.ready().then(() => {
			console.log(routeData);
			console.log(markerData);
			this.routeData = [];
			this.routeData.push(routeData[currentTrack.index]);
			
			this.markerData = markerData;
			let self = this;
			this.gpsStatusImage = 'assets/imgs/gps/gps_0.png';
			this.gpsStatusTitle = 'No Signal';
			this.enableAudio = false;
			this.nativeAudio.preloadSimple('uniqueId1', 'assets/audio/alert.mp3');
			this.nativeAudio.preloadComplex('loopAudio', 'assets/audio/run.mp3', 1, 1, 8000).then(()=>{
				// this.audio();
			});
			this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
			if (this.navParams.data != null) {
				this.data = this.navParams.data;
			}
			this.status = 'Pauza'
			currentRun.showRunning = 1;
			// setTimeout(()=>{
			// 	// this.event.publish('movement',true);
			// 	this.event.publish('geolocation',true);
			// }, 3000)
			startTimeRecord();
			this.timetrack();
			this.instructions_dir = "Začít běh";
			this.event.subscribe('instructions',function(data){
				self.instructions_dis = 'Po ' + data.distance.text + ', ' + data.estimate.text + '\n';
				$('#instruction').html(data.instruction);
				console.log(data.instruction)
				let index = [];
				let bcopy = false;
				let temp = [];
				for(let i = 0; i < data.instruction.length; i++) {
					let letter = data.instruction[i];
					console.log(letter)
					if (letter == '<') {
						bcopy = true;
					}
					if (!bcopy) {
						temp.push(letter);
					}
					if (letter == '>') {
						bcopy = false;
						temp.push(' ');
					}
				}
				let letters = temp.toString();
				letters = letters.replace(/,/g , "");
				console.log(temp);
				console.log(letters);
				if (letters != self.pre_letters) {
					self.TextShow = false;
					self.pre_letters = letters;
					setTimeout(()=> {
						self.TextShow = true;
					},100)
				}
 				self.nativeAudio.play('uniqueId1');
				setTimeout(()=>{
					self.instructions_dir = letters;
					const option = {
						text: self.instructions_dis + letters ,
						locale: 'cs-CZ',
						rate: 0.8
					}
					self.tts.speak(option)
					.then(() => console.log('Success'))
					.catch((reason: any) => console.log(reason));
				}, 2000)
			});
			this.event.subscribe('finish',function(data){
				self.finish()
			});
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NavigationPage');
		this.locationTrackerProvider.startTracking();
	}

	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
	}

	ionViewWillLeave(): void {
		this.tabBarElement.style.display = 'flex';
	}

	timetrack() {
		this.timer = setInterval(()=> {
			if (currentRun.status == 1) {
				this.gpsStatus = this.locationTrackerProvider.getGPSstatus();
				if (this.gpsStatus >= 2.5) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_5.png';
					this.gpsStatusTitle = 'Plný';
				}
				if (this.gpsStatus >= 2 && this.gpsStatus < 2.5) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_4.png';
					this.gpsStatusTitle = 'Lepší';
				}
				if (this.gpsStatus >= 1.5 && this.gpsStatus < 2) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_3.png';
					this.gpsStatusTitle = 'Dobrý';
				}
				if (this.gpsStatus >= 1 && this.gpsStatus < 1.5) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_2.png';
					this.gpsStatusTitle = 'Méně';
				}
				if (this.gpsStatus > 0 && this.gpsStatus < 1) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_1.png';
					this.gpsStatusTitle = 'Špatný';
				}
				if (this.gpsStatus == 0) {
					this.gpsStatusImage = 'assets/imgs/gps/gps_0.png';
					this.gpsStatusTitle = 'Bez signálu';
				}
				currentRun.time = currentTimeRecord();
				this.time = seconds2Hms(currentRun.time);
				console.log(currentRun.distance);
				this.distance =   String(Math.round(currentRun.distance*100)/100) + ' km';
			}
		},3000);
	}

	finish() {
		// this.locationTrackerProvider.stopTracking();
		clearInterval(this.timer);
		this.navCtrl.setRoot('FinishPage');
	}

	pause() {
		pauseTimeRecord();
		clearInterval(this.timer);
		if (currentRun.status == 1) {
			currentRun.status = 2;
			this.status = 'Pokračovat';
		} else {
			currentRun.prevPoint = [userGLocation.lat,userGLocation.lng];
			currentRun.status = 1;
			resumeTimeRecord();
			this.timetrack();
			this.status = 'Pauza';
		}
	}

	gotoMe() {
		this.event.publish('gotome',true);
	}

	movement(handle) {
		if (handle == 'up') {
			userGLocation.lat +=0.0001;
			this.event.publish('geolocation',true);
		}
		if (handle == 'down') {
			userGLocation.lat -=0.0001;
			this.event.publish('geolocation',true);
		}
		if (handle == 'left') {
			userGLocation.lng -=0.0001;
			this.event.publish('geolocation',true);
		}
		if (handle == 'right') {
			userGLocation.lng +=0.0001;
			this.event.publish('geolocation',true);
		}
	}
	audio() {
		this.enableAudio = !this.enableAudio;
		if (this.enableAudio) {
			console.log('loop');
			this.nativeAudio.loop('loopAudio');
		} else {
			console.log('stop');
			this.nativeAudio.stop('loopAudio');
		}
	}

}
