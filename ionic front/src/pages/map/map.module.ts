import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
		MapPage,
	],
	imports: [
		ComponentsModule,
		IonicPageModule.forChild(MapPage),
	],
})
export class MapPageModule { }
