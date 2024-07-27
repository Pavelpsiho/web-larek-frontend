import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IPageView, TPage, TPageActions, TUpdateCounter } from '../types';

export class Page extends Component<TPage> implements IPageView {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _cart: HTMLElement;
    protected _cartCounter: HTMLElement;

    constructor(container: HTMLElement, actions: TPageActions) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
        this._cart = ensureElement<HTMLElement>('.header__basket', container);
        this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter', container);

        if (actions?.onClick) this._cart.addEventListener('click', actions.onClick);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set cartCounter(data: TUpdateCounter) {
        this.setText(this._cartCounter, data.count);
    }

    set locked(value: boolean) {
        if (value) this.addStyleClass(this._wrapper, 'page__wrapper_locked');
        else this.removeStyleClass(this._wrapper, 'page__wrapper_locked');
    }
}
