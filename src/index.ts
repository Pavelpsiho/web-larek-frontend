import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL as items, CDN_URL as images } from './utils/constants';
import { StoreAPI } from './components/api';
import { AppState } from './components/appdata';
import { Page } from './components/page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICatalogItem, ICartItem, TUpdateCounter } from './types';
import { Card as CatalogItem, Card as CartItem } from './components/card';
import { Modal } from './components/modal';
import { ShoppingCart } from './components/shoppingсart';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/success';

const events = new EventEmitter();
const api = new StoreAPI({ items, images });
const appData = new AppState(events);

const page = new Page(document.body, {
	onClick: (event) => events.emit('cart:open', event),
});
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const shoppingCart = new ShoppingCart(cloneTemplate(cartTemplate), {
	onClick: () => events.emit('order:open'),
});

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:changed', item),
		});
		card.setCategoryCard(item.category);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('preview:changed', (item: ICatalogItem) => {
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('cart:changed', item),
	});
	card.button.disabled = item.status;
	card.setCategoryCard(item.category);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			description: item.description,
			statusBtn: item.status,
		}),
	});
});

events.on('cart:open', () => {
	appData.setCartPreview();
	shoppingCart.price = appData.getTotal();
	modal.render({ content: shoppingCart.render() });
});

events.on('cart:preview', (cartState: TUpdateCounter) => {
	shoppingCart.items = appData.cartItems.map((item) => {
		const cartItem = new CartItem(cloneTemplate(itemCartTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return cartItem.render({
			title: item.title,
			price: item.price,
		});
	});
	shoppingCart.setOrderButton(cartState.count);
	shoppingCart.setOrderIndex();
});

events.on('cart:changed', (item: ICatalogItem) => {
	if (!item.status) {
		appData.addItemCart(item);
		modal.toggleCartBtn(item.status);
	}
});

events.on('card:remove', (item: ICartItem) => {
	appData.removeCartItem(item);
	appData.setCartPreview();
});

const order = new Order(cloneTemplate(orderTemplate), events, {
	onClickPayment: (event: Event) => {
		const paymentType = (event.target as HTMLElement).getAttribute('name');
		appData.setPaymentType(paymentType);
		order.setStyleBorder(paymentType);
		order.setNextToggle(appData.isOrderValid());
	},
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: appData.isOrderValid(),
			errors: [],
		}),
	});
});

events.on('order.address:change', () => {
	appData.setAddress(order.address);
	order.setNextToggle(appData.isOrderValid());
});

events.on('orderErrors:change', (errors: Record<string, string>) => {
	if (errors) order.errors = `${errors.payment || ''} ${errors.address || ''}`;
	else order.errors = '';
});

events.on('contactsErrors:change', (errors: Record<string, string>) => {
	if (errors) contacts.errors = `${errors.email || ''} ${errors.phone || ''}`;
	else order.errors = '';
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: appData.isContactsValid(),
			errors: [],
		}),
	});
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), events, {
	onClick: () => {
		appData.createOrder();
		api
			.orderItems(appData.order)
			.then((response) => {
				console.log(response);
				appData.clearAllItems();
				events.emit('success');
			})
			.catch((error) => {
				events.emit('cart:open');
				console.error(error);
			});
	},
});

events.on(/^contacts\..*:change/, () => {
	appData.setPhone(contacts.phone);
	appData.setEmail(contacts.email);
	contacts.setNextToggle(appData.isContactsValid());
	appData.isContactsValid();
});

events.on('success', () => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			events.emit('items:changed');
			modal.close();
		},
	});
	modal.render({
		content: success.render({
			totalPrice: appData.getTotal(),
		}),
	});
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

events.on('cart:updateCounter', (count: TUpdateCounter) => {
	page.cartCounter = count;
});

api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => console.log(error));
