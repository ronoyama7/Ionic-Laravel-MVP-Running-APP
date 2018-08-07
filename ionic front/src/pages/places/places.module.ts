import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacesPage } from './places';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
		PlacesPage,
	],
	imports: [
		IonicPageModule.forChild(PlacesPage),
		ComponentsModule
	],
})
export class PlacesPageModule { }
