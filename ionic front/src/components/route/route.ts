import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
	selector: 'route',
	templateUrl: 'route.html'
})
export class RouteComponent {
	@Input() item: Array<any> = [];
	constructor(
		private nav: NavController
	) {
	}

	open() {
		this.nav.push('RoutePage', {
			data: this.item
		});
	}

}
