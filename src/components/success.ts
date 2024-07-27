import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { ISuccessView, TSuccessActions, TSuccessForm } from '../types';
import { IEvents } from './base/events';

export class Success extends Component<TSuccessForm> implements ISuccessView {
	protected _close: HTMLElement;
	protected _totalPrice: HTMLParagraphElement;
	constructor(container: HTMLFormElement, actions: IEvents) {
		super(container);
		this._totalPrice = ensureElement<HTMLParagraphElement>('.order-success__description',
			this.container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._close.addEventListener('click', () => actions.emit('success:finish'));
	}
	set totalPrice(value: number) {
		this.setText(this._totalPrice, `Списано ${value} синапсов`);
	}
}