import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocationTrackerProvider } from '../providers/location-tracker';
import { userGLocation } from '../providers/global';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = 'LoadingPage';

	constructor(
		private platform: Platform, 
		private screenOrientation: ScreenOrientation,
		private splashScreen: SplashScreen,
		private backgroundMode: BackgroundMode,
		private tracker : LocationTrackerProvider,
		private events: Events,
	) {
		this.platform.ready()
			.then(() => {
				this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
				this.tracker.getCurrentLocation().then((result) => {
					console.log(result);
					this.events.publish('geolocation',userGLocation);
					this.splashScreen.hide();
				});
				this.tracker.startTracking();
				this.backgroundMode.setDefaults({ 
					title: 'Running App', 
					text: 'Active in background...'}
				);
				this.backgroundMode.enable();
			});
	}
}
