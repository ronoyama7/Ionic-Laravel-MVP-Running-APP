import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
	selector: 'place',
	templateUrl: 'place.html'
})
export class PlaceComponent {
	@Input() item: Array<any> = [];

	constructor(
		private nav: NavController
	) {
	}

	open() {
		this.nav.push('PlacePage', {
			data: this.item
		});
	}

}
