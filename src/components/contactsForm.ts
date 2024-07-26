import { IContactsFormView, TContactsActions, TContactsForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './form';

export class Contacts extends Form<TContactsForm> implements IContactsFormView {
    protected _close: HTMLElement;

    constructor(
        container: HTMLFormElement,
        events: IEvents,
        actions: TContactsActions
    ) {
        super(container, events);

        if (actions.onSubmit) {
            this.events.on(`${this.container.name}:submit`, (event: Event) => {
                actions.onSubmit(event);
            });
        }

        this.valid = false;
    }

    get phone() {
        return this.container.phone.value;
    }

    set phone(value: string) {
        this.container.phone.value = value;
    }

    get email() {
        return this.container.email.value;
    }

    set email(value: string) {
        this.container.email.value = value;
    }

    setNextToggle(state: boolean) {
        this.valid = state;
    }
}
