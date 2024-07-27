import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModalView, TModalData } from '../types';

export class Modal extends Component<TModalData> implements IModalView {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            container
        );
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    _toggleModal(state = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }

    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal();
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false);
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: TModalData): HTMLElement {
        super.render(data);
        this.content = data.content;
        this.open();
        return this.container;
    }
}
