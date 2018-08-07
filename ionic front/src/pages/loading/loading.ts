import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GetJsonData } from '../../providers/global';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
	selector: 'page-loading',
	templateUrl: 'loading.html',
})
export class LoadingPage {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private storage : Storage,
		private platform: Platform,
		private getData: GetJsonData,
	) {
		let self =  this;
		platform.ready().then(() => {
			this.getData.getDatafromJson().then((res) =>{
				self.storage.get('onboard').then((data) => {
					self.storage.set('onboard',true);
					if(data != null) {
						setTimeout(()=>{
							this.navCtrl.setRoot('TabsPage');
						},2000);
					} else {
						setTimeout(()=>{
							this.navCtrl.setRoot('OnboardingPage');
						},2000);
					}
				});
			});
		});
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad LoadingPage');
	}
}
