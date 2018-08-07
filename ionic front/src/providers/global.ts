import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';
import { StorageService } from './storage.service';
// import { getRoute, getRoute2MapData } from './google-service';
export const userGLocation = {
	lat: 50.0770905,
	lng: 14.4301704,
	heading: 0,
	speed: 0,
}
export const userGPrvLocation = {
	lat: 34.695283,
	lng: 135.4713531,
}
export const navGLocation = {
	lat: 0,
	lng: 0,
}
export const currentTrack = {
	index: -1,
	type: '',
};
export const gpsStatus = {
	counter: -1,
	status: 0,
	value: 0,
	values: [],
};
export const env = {
	debug: false,
	mode: 0,
	speed: 1,
	movement: true,
}
export const currentRun = {
	track: -1,
	pin: -1,
	time: 0,
	distance: 0,
	status: 0,
	start: [0, 0],
	prevPoint: [0, 0],
	current: [userGLocation.lat, userGLocation.lng],
	showRunning: 0,
	audioPlayed: false,
}

const http = Http;

export var routeData = [];
export var markerData = [];
export var onBoardData = [];
export var aboutData = [];

@Injectable()
export class GetJsonData {
	constructor(
		public http: Http,
		private storage: StorageService
	) {

	}

	getDatafromJson() {
		return new Promise<any>((resolve, reject) => {
			Promise.all([
				this.storage.get('track'),
				this.storage.get('place'),
				this.storage.get('onboard'),
				this.storage.get('about')
			])
				.then(storedData => {
					console.log(storedData);
					if (storedData[0] !== 'false') {
						this._processTrackData(JSON.parse(storedData[0]))
					}
					if (storedData[1] !== 'false') {
						this._processMarkerData(JSON.parse(storedData[1]));
					}
					if (storedData[2] !== 'false') {
						onBoardData = JSON.parse(storedData[2]);
					}
					if (storedData[3] !== 'false') {
						aboutData = JSON.parse(storedData[3]);
					}

					if (storedData.every(data => data !== 'false')) {
						resolve();
						this._httpGet();
					} else {
						this._httpGet()
							.then(() => resolve())
							.catch(error => reject(error));
					}

				})
		})

	}

	private _httpGet(): Promise<any> {
		let promiseAll = [];
		let api_url = 'http://api.bezeckemapy-ceskalipa.cz/api/';

		promiseAll[0] = new Promise((resolve, reject) => {
			this.http.get(api_url + 'track').map(res => res.json()).subscribe(data => {
				this.storage.set('track', JSON.stringify(data));
				this._processTrackData(data);
				resolve();
			});
		});
		promiseAll[1] = new Promise((resolve, reject) => {
			this.http.get(api_url + 'place').map(res => res.json()).subscribe(data => {
				this.storage.set('place', JSON.stringify(data));
				this._processMarkerData(data);
				resolve();
			});
		});
		promiseAll[2] = new Promise((resolve, reject) => {
			this.http.get(api_url + 'onboard').map(res => res.json()).subscribe(data => {
				this.storage.set('onboard', JSON.stringify(data));
				onBoardData = data;
				resolve();
			});
		});
		promiseAll[3] = new Promise((resolve, reject) => {
			this.http.get(api_url + 'about').map(res => res.json()).subscribe(data => {
				this.storage.set('about', JSON.stringify(data));
				console.log(data);
				aboutData = data;
				resolve();
			});
		});

		return Promise.all(promiseAll)
	}

	private _processTrackData(data: any): void {
		routeData = [];
		for (let i = 0; i < data.length; i++) {
			let temp = JSON.parse(data[i].data);
			temp.index = i;
			temp.speed = "10km";
			console.log(temp);
			routeData.push(temp);
		}
	}

	private _processMarkerData(data: any): void {
		markerData = [];
		for (let i = 0; i < data.length; i++) {
			let temp = JSON.parse(data[i].data);
			temp.index = i;
			temp.type = 'parking';
			console.log(temp);
			markerData.push(temp);
		}
	}
}

export function calculateDistance() {
	if (currentRun.status == 1 && currentRun.prevPoint != [userGLocation.lat, userGLocation.lng]) {
		let plus = getDistanceFromLatLonInKm(currentRun.prevPoint[0], currentRun.prevPoint[1], userGLocation.lat, userGLocation.lng);
		if (plus < 0.5) {
			currentRun.distance += plus;
		}
		console.log(currentRun.distance);
		currentRun.prevPoint = [userGLocation.lat, userGLocation.lng];
	} else {
		currentRun.prevPoint = [userGLocation.lat, userGLocation.lng];
	}
	if (userGPrvLocation.lat == 0) {
		userGPrvLocation.lat = userGLocation.lat;
		userGPrvLocation.lng = userGLocation.lng;
	}
}



export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}