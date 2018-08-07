import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { onBoardData } from '../../providers/global';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-onboarding',
	templateUrl: 'onboarding.html',
})
export class OnboardingPage {
	// commented tabBarElement because I'm not sure if neccessary

	// tabBarElement: HTMLDivElement;
	pageIndex: any;
	@ViewChild(Slides) slides: Slides;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
	) {
		this.pageIndex = 0;
	}
	ionViewDidLoad() {
		console.log(onBoardData);
		$('#editor-1').html(onBoardData[0].data);
		$('#editor-2').html(onBoardData[1].data);
		$('#editor-3').html(onBoardData[2].data);
	}
	skip() {
		this.navCtrl.setRoot('TabsPage');

	}
	
	slideChanged() {
		console.log(this.pageIndex)
		this.pageIndex = this.slides.getActiveIndex();
		if (this.pageIndex == 3) {
			this.pageIndex = 2;
		}
	}

}
