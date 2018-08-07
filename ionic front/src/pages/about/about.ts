import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from "@ionic/storage";
import { aboutData } from '../../providers/global';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private http: Http,
		private storage: Storage,
		private platform: Platform,
		) {
			// platform.ready().then(() => {
			// 	let self = this;
			// 	self.storage.get('about').then((data) => {
			// 		if(data === null) {
			// 				$('#editor').html(data);
			// 				self.storage.set('about',JSON.stringify(aboutData[0].data));
			// 		} else {
			// 			$('#editor').html(aboutData[0].data);
			// 			self.storage.set('about',JSON.stringify(aboutData[0].data));
			// 		}
					
			// 	})
			// });
		}

	ionViewDidLoad() {
		console.log(aboutData[0].data);
		$('#editor').html(aboutData[0].data);
		console.log('ionViewDidLoad AboutPage');
	}

}
