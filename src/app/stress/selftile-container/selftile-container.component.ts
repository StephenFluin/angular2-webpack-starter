import {
	Component, OnInit, OnDestroy, ChangeDetectionStrategy,
	ChangeDetectorRef
} from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { PriceService } from "../../home/price.service";
import { AppState } from "../../app.service";
import { NgZone } from '@angular/core';

@Component({
	selector: 'self-tile-container',
	templateUrl: './selftile-container.component.html',
	styleUrls: ['./selftile-container.component.css'],
})
export class SelfTileContainerComponent implements OnInit, OnDestroy {

	currencyPairs: Array<string>;
	state: any = { selectedPairs: [] };
	randomNumbers: Observable<number>;
	disposables: Subscription;
	selectedPairs: Array<any>;
	isWorker: boolean;
	//state: Object;
	frequency: number = 50;

	constructor(private priceService: PriceService, private appState: AppState, private cd: ChangeDetectorRef, private zone: NgZone) {


		this.state = this.appState.get();

		if (!this.state.hasOwnProperty('selectedPairs')) {
			this.state = {
				selectedPairs: []
			};
			this.appState.set('selectedPairs', this.state.selectedPairs);
		}
		cd.detach();
		zone.runOutsideAngular(() => {
		setInterval(() => {
			console.log("cd marked to happen");
			this.cd.markForCheck();
			this.cd.detectChanges();
			
		 }, 50);
		});


	}

	ngOnInit(): void {

		this.currencyPairs = ['USD EUR', 'USD JPY', 'GBP USD', 'USD CAD'];

		this.state = this.appState.get();

		if (this.state.selectedPairs.length == 0) {

			this.state.selectedPairs.push({
				key: 'USD EUR'
			});

			this.appState.set('selectedPairs', this.state.selectedPairs);

		}
	}

	ngOnDestroy(): void {
		this.stop();
	}

	/**
	 * Function to start the price
	 */
	start() {

		console.log('start pressed');
	}

	public startWorker() {

	}

	stop() {
		if (this.disposables) {
			this.disposables.unsubscribe();
		}
		this.priceService.stopWorkerPrices();
	}

	addPair(selectedPair) {
		//for (let i = 0; i < 10; i++) {
		if (!selectedPair) {
			this.currencyPairs.forEach((pair) => {
				this.state.selectedPairs.push({
					key: pair,
					streamType: this.isWorker ? 'worker' : 'rx'
				});
			});
		} else {
			this.state.selectedPairs.push({
				key: selectedPair,
				streamType: this.isWorker ? 'worker' : 'rx'
			});
		}
		this.appState.set('selectedPairs', this.state.selectedPairs);


	}

	clearAll() {
		this.stop();
		this.state.selectedPairs = [];
		this.appState.set('selectedPairs', this.state.selectedPairs);
	}

}

