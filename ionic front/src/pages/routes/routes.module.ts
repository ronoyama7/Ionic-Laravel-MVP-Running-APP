import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutesPage } from './routes';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
		RoutesPage,
	],
	imports: [
		IonicPageModule.forChild(RoutesPage),
		ComponentsModule
	],
})
export class RoutesPageModule { }
