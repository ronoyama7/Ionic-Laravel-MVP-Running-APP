import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class StorageService {

	constructor(
		private platform: Platform,
		private nativeStorage: NativeStorage
	) { }

	get(key: string): Promise<string> {
		return new Promise((resolve, reject) => {
			(this.platform.is('cordova')) 
				? this.nativeStorage.getItem(key)
					.then(data => {
						if(data === true) resolve('true');
						else if(data === false) resolve('false');
						else resolve(data);
					})
					.catch(() => resolve('false'))
				: resolve(this._get(key));
		});
	}

	_get(key: string): string {
		let item = localStorage.getItem(key);
		if(!item) return 'false';
		return item;
	}

	set(key: string, value: any) {
		return new Promise((resolve, reject) => {
			if(this.platform.is('cordova')) 
				this.nativeStorage.setItem(key, value)
					.then(() => resolve())
					.catch(err => reject(err))
			else {
				localStorage.setItem(key, value);
				setTimeout(() => {
					resolve();
				}, 150);
			}
		})
	}

	delete(key: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if(this.platform.is('cordova')) {
				this.nativeStorage.remove(key)
					.then(data => resolve(true))
					.catch(() => reject(null))
			} else {
				localStorage.removeItem(key);
				resolve(true);
			}
		});
	}

}
