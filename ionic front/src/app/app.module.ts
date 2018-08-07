import { NativeStorage } from '@ionic-native/native-storage';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeAudio } from '@ionic-native/native-audio';
import { StorageService } from './../providers/storage.service';

import { GetJsonData } from '../providers/global'
import { LocationTrackerProvider } from '../providers/location-tracker';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		IonicStorageModule.forRoot(),
		HttpModule,
		IonicModule.forRoot(MyApp, {
    		backButtonText: 'Zpět'
    	})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		StatusBar,
		SplashScreen,
		ScreenOrientation,
		NativeStorage,
		Geolocation,
		BackgroundGeolocation,
		GoogleMaps,
		BackgroundMode,
		TextToSpeech,
		LocationTrackerProvider,
		GetJsonData,
		NativeAudio,
		StorageService,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
