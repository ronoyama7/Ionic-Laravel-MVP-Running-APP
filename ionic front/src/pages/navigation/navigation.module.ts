import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavigationPage } from './navigation';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
		NavigationPage,
	],
	imports: [
		IonicPageModule.forChild(NavigationPage),
		ComponentsModule,
	],
})
export class NavigationPageModule { }
