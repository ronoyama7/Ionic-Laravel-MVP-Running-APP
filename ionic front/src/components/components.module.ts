import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RouteComponent } from './route/route';
import { PlaceComponent } from './place/place';
import { MapComponent } from './map-component/map-component';

@NgModule({
	declarations: [
    	RouteComponent,
		PlaceComponent,
		MapComponent,
	],
	imports: [
		IonicModule
	],
	exports: [
    	RouteComponent,
		PlaceComponent,
		MapComponent,
	]
})
export class ComponentsModule {}
