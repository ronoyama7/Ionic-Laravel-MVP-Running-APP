import { Injectable , NgZone} from '@angular/core';
import { Events, ToastController } from 'ionic-angular';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Storage} from "@ionic/storage";
import { navGLocation, currentRun, getDistanceFromLatLonInKm, userGLocation, env, currentTrack,gpsStatus } from './global';
import { getCurrentTimeStamp } from './time-service'
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationTrackerProvider {

    public watch: any;    
    public lat: number = 0;
    public lng: number = 0;
    public locate: any;
    public gps: number;
    public highAccuracy: boolean;
    public preGps = [0,0];

    constructor(    
      public zone: NgZone,
      public backgroundGeolocation : BackgroundGeolocation,
      public geolocation : Geolocation,
      private storage : Storage,
      private events: Events, 
      private toastCtrl: ToastController,
    ) 
    {

      this.storage.get('high').then(
        data =>{                           
            if(data != null)         
                this.highAccuracy = data;                
            if(data == null)
                this.highAccuracy = true;
        }
      );
    }
    getCurrentLocation () {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.geolocation.getCurrentPosition().then(position => {
        if (!env.movement) {
          resolve();
          return;
        }
        self.lat = position.coords.latitude;
        self.lng = position.coords.longitude;   
        userGLocation.lat = self.lat;
        userGLocation.lng = self.lng;
        let toast = self.toastCtrl.create({
          message: 'CurrentGeoLocation  ' + userGLocation.lat + '  ' + userGLocation.lng,
          duration: 1000,
          position: 'bottom'
        });
        // toast.present();
        gpsStatus.status = 1;
        resolve(userGLocation);
      }).catch(err => {
        gpsStatus.status = 2;
      });
      });
    }

    getGPSstatus() {
        let status = 0;
        let diff = getCurrentTimeStamp() - gpsStatus.counter;
        if (diff < 5) {
          status = 3;
        }
        if (diff >= 5 && diff < 9) {
          status = 2;
        }
        if (diff >= 9 && diff < 15) {
          status = 1;
        }
        if (diff > 15) {
          status = 0;
        }
        gpsStatus.values.push(status);
        if (gpsStatus.values.length > 5) {
          gpsStatus.values.shift();
        }
        gpsStatus.value = 0;
        let count = 1;
        gpsStatus.values.forEach(function(data) {
          gpsStatus.value +=data;
            count ++;
        });
        // if (count == 0) {
        //   count = 1;
        // }
        // if (count >= 9) {
        //   count = 10;
        // }
        if (gpsStatus.status == 2) {
          status = 0;
          gpsStatus.values = [];
          gpsStatus.value = 0;
          count = 1;
        }
        return gpsStatus.value/count;
    }
     
    startTracking() {
      setTimeout(()=>{
        this.geolocation.getCurrentPosition().then(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          userGLocation.lat = this.lat;
          userGLocation.lng = this.lng;
          gpsStatus.counter = getCurrentTimeStamp();
          this.events.publish('geolocation',userGLocation);
          this.startTracking();
        }).catch(err => {
          gpsStatus.value = 2;
          this.startTracking();
        });
      },1000);
    }
    startTrackingBackGround() {    
        gpsStatus.counter = 10;
        this.getGPSstatus();
        // Background Tracking             
        let config = {
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 10, 
          interval: 1000,
          debug: true
        };      

        this.backgroundGeolocation.configure(config).subscribe((location) => {
            
            this.locate = location;        
            // Run update inside of Angular's zone
            this.zone.run(() => {
              this.lat = location.latitude;
              this.lng = location.longitude;             
              userGLocation.lat = this.lat;
              userGLocation.lng = this.lng;
              let toast = this.toastCtrl.create({
                message: 'BackGroundGeoLocation  ' + userGLocation.lat + '  ' + userGLocation.lng,
                duration: 1000,
                position: 'bottom'
              });
              toast.present();
              this.events.publish('geolocation',userGLocation);
              gpsStatus.status = 1;
            });        
        }, (err) => {      
          gpsStatus.status = 2;
        });
        this.backgroundGeolocation.start();      
      
        // Foreground Tracking            
        let options = {
          frequency: 10000, 
          enableHighAccuracy: true
        };
        
        this.geolocation.getCurrentPosition().then(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          userGLocation.lat = this.lat;
          userGLocation.lng = this.lng;
          let toast = this.toastCtrl.create({
            message: 'CurrentGeoLocation  ' + userGLocation.lat + '  ' + userGLocation.lng,
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
          this.events.publish('geolocation',userGLocation);
        }).catch(err => {
          gpsStatus.status = 2;
        });   
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {      
          console.log(position.coords.latitude);
          this.zone.run(() => {
            console.log("Foreground");
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            userGLocation.lat = this.lat;
            userGLocation.lng = this.lng;
            let toast = this.toastCtrl.create({
              message: 'ForegroundGeoLocation  ' + userGLocation.lat + '  ' + userGLocation.lng,
              duration: 1000,
              position: 'bottom'
            });
            gpsStatus.status = 1;
            toast.present();
            this.events.publish('geolocation',userGLocation);
          });
        });
    }
    
    stopTracking() {   
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
    }
}
