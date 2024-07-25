# Web-ларёк

Web-ларёк - это интернет-магазин с товарами для веб-разработчиков. В магазине можно просмотреть каталог товаров, добавить товары в корзину и оформить заказ.

## Используемый стек

- **Фронтенд**: React.js, Redux, styled-components
- **Бэкенд**: Node.js, Express.js
- **База данных**: MongoDB
- **API**: RESTful
- **Сборка**: Webpack, Babel
- **Контроль версий**: Git, GitHub
- **Документация**: README.md, JSDoc для документирования кода
- **Тестирование**: Jest, React Testing Library, Supertest

## Инструкция по сборке и запуску

### Установка зависимостей

```
npm install
```
## Запуск приложения
```
npm start
```
## Запуск тестов
```
npm test
```
## Описание базовых классов, их предназначение и функции
### Классы
#### EventEmitter
Класс `EventEmitter` обеспечивает работу событий. Его функции:
- #### Свойства:
- `events`: объект, который хранит события и их слушателей.
- #### Методы:
- on(event: string, listener: (...args: any[]) => void): void: Устанавливает слушателя для события.
- off(event: string, listener: (...args: any[]) => void): void: Удаляет слушателя для события.
- emit(event: string, ...args: any[]): void: Вызывает слушателей события.
#### ProductModel
Модель ProductModel отвечает за управление данными товаров.
- #### Конструктор:
- Принимает объект API клиента для взаимодействия с сервером.
- #### Свойства:
- products: Product[]: массив товаров.
- #### Методы:
- fetchProducts(): Promise<void>: Получает список товаров с сервера.
- getProductById(id: string): Product: Возвращает товар по идентификатору.
#### CartModel
Модель `CartModel` отвечает за управление данными корзины. Ее функции:
- #### Конструктор:
- Принимает объект EventEmitter для управления событиями.
- #### Свойства:
- items: CartItem[]: массив товаров в корзине.
- #### Методы:
- addToCart(product: Product): void: Добавляет товар в корзину.
- removeFromCart(productId: string): void: Удаляет товар из корзины.
- getCart(): Cart: Возвращает текущее состояние корзины.
### Компоненты
#### Component (View)
Базовый класс для всех компонентов управления DOM-элементами.
- #### Конструктор:
- Принимает элемент DOM для управления.
- #### Свойства:
- element: HTMLElement: DOM-элемент, которым управляет компонент.
- #### Методы:
- addClass(className: string): void: Добавляет класс к элементу.
- removeClass(className: string): void: Удаляет класс у элемента.
- setText(text: string): void: Устанавливает текст элемента.
- toggleClass(className: string): void: Переключает класс у элемента.
#### ProductList
Компонент ProductList отображает список товаров.
- #### Конструктор:
- Принимает элемент DOM для управления и массив товаров для отображения.
- #### Свойства:
- element: HTMLElement: DOM-элемент, которым управляет компонент.
- #### Методы:
- render(products: Product[]): void: Отображает список товаров.
#### ProductDetail
Компонент ProductDetail отображает детальную информацию о товаре.
- #### Конструктор:
- Принимает элемент DOM для управления и объект товара для отображения.
- #### Свойства:
- element: HTMLElement: DOM-элемент, которым управляет компонент.
- #### Методы:
- render(product: Product): void: Отображает информацию о товаре.

### ViewModels
#### ProductViewModel
ViewModel `ProductViewModel` соединяет представления с моделями и обрабатывает логику UI.
- #### Конструктор:
- Принимает объект модели товара и EventEmitter для управления событиями.
- #### Свойства:
- productModel: ProductModel: модель товара.
- #### Методы:
- fetchProducts(): Promise<void>: Получает список товаров и вызывает событие VIEW_PRODUCT.
- viewProduct(productId: string): void: Вызывает событие VIEW_PRODUCT с информацией о товаре.

### Перечисление событий
События корзины
```
enum CartEvent {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  CHECKOUT = "CHECKOUT"
}
```
События товара
```
enum ProductEvent {
  VIEW_PRODUCT = "VIEW_PRODUCT",
  CLOSE_PRODUCT_MODAL = "CLOSE_PRODUCT_MODAL"
}
```
Процессы в приложении
- Добавление товара в корзину: Компонент вызывает метод `addToCart` из `CartViewModel`, который добавляет товар в модель корзины и вызывает событие `ADD_TO_CART`.
- Удаление товара из корзины: Компонент вызывает метод `removeFromCart` из `CartViewModel`, который удаляет товар из модели корзины и вызывает событие `REMOVE_FROM_CART`.
- Оформление заказа: Компонент вызывает метод checkout из `CartViewModel`, который проверяет данные заказа и вызывает событие `CHECKOUT` при успешной проверке.

### Типы данных
#### Product
Представляет товар в магазине.
```
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}
```
#### Cart
Представляет корзину пользователя.
```
interface Cart {
  items: CartItem[];
  totalAmount: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}
```
#### Order
Представляет заказ.
```
interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerEmail: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
}
```
## API Интерфейсы
### Интерфейс API-клиента
```
interface ApiClient {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createOrder(order: Order): Promise<Order>;
}
```
### Интерфейсы моделей данных
```
interface ProductModel {
  fetchProducts(): Promise<void>;
  getProductById(id: string): Product;
}

interface CartModel {
  addToCart(product: Product): void;
  removeFromCart(productId: string): void;
  getCart(): Cart;
}
```
### Интерфейсы отображений
```
interface ProductListView {
  render(products: Product[]): void;
}

interface ProductDetailView {
  render(product: Product): void;
}

interface CartView {
  render(cart: Cart): void;
}
```
### Интерфейсы базовых классов
```
interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  off(event: string, listener: (...args: any[]) => void): void;
}
```
### Перечисление событий и их интерфейсы
```
enum CartEvent {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  CHECKOUT = "CHECKOUT"
}

enum ProductEvent {
  VIEW_PRODUCT = "VIEW_PRODUCT",
  CLOSE_PRODUCT_MODAL = "CLOSE_PRODUCT_MODAL"
}
```
# Архитектура проекта Web-ларёк
Архитектура проекта Web-ларёк основана на MVVM (Model-View-ViewModel) паттерне, что позволяет разделить логику представления и бизнес-логику приложения. Коммуникация между компонентами осуществляется через события, управляемые брокером событий (EventEmitter). Ниже приводится описание основных частей архитектуры проекта и их взаимодействие.

### Основные компоненты:
1. Модели (Models):
- Отвечают за данные и бизнес-логику приложения.
- Взаимодействуют с API для получения данных и выполнения операций.
- Примеры: ProductModel, CartModel.
2. Представления (Views):
- Отвечают за отображение данных и взаимодействие с пользователем.
- Представлены в виде React-компонентов.
- Примеры: ProductList, ProductDetail, Cart, CheckoutForm.
3. ViewModels:
- Соединяют Представления с Моделями.
- Обрабатывают логику пользовательского интерфейса и взаимодействие с Моделями.
- Примеры: ProductViewModel, CartViewModel.
4. Брокер событий (EventEmitter):
- Управляет событиями в приложении, обеспечивает взаимодействие между компонентами.
- Позволяет устанавливать и снимать слушателей событий, а также вызывать их при возникновении событий.

### Основные классы:
#### EventEmitter:
Класс, обеспечивающий работу событий. Его функции включают установку и снятие слушателей событий, а также вызов слушателей при возникновении события.
- #### Конструктор:
- `constructor()`: Создает пустой объект `events` для хранения событий и их слушателей.
- #### Свойства:
- `events: { [key: string]: Function[] }`: Объект для хранения событий и их слушателей.
- #### Методы:
- `on(event: string, listener: Function): void`: Добавляет слушателя для указанного события.
- `off(event: string, listener: Function): void`: Удаляет слушателя для указанного события.
- `emit(event: string, ...args: any[]): void`: Вызывает всех слушателей указанного события, передавая им аргументы.
### Модели
#### ProductModel
Модель для управления данными товаров.
- #### Конструктор:
- `constructor(apiClient: ApiClient)`: Принимает объект API клиента для взаимодействия с сервером.
- #### Свойства:
- `products: Product[]`: Массив товаров.
- #### Методы:
- `fetchProducts(): Promise<void>`: Получает список товаров с сервера и сохраняет их в `products`.
- `getProductById(id: string)`: Product: Возвращает товар по идентификатору.
#### CartModel
Модель для управления данными корзины.
- #### Конструктор:
- `constructor(eventEmitter: EventEmitter)`: Принимает объект EventEmitter для управления событиями.
- #### Свойства:
- `items: CartItem[]`: Массив товаров в корзине.
- #### Методы:
- `addToCart(product: Product): void`: Добавляет товар в корзину и вызывает событие `ADD_TO_CART`.
- `removeFromCart(productId: string): void`: Удаляет товар из корзины и вызывает событие `REMOVE_FROM_CART`.
- `getCart(): Cart`: Возвращает текущее состояние корзины.

### Компоненты (Views)
#### Component (View)
Базовый класс для всех компонентов управления DOM-элементами.
- #### Конструктор:
- `constructor(element: HTMLElement)`: Принимает элемент DOM для управления.
- #### Свойства:
- `element: HTMLElement`: DOM-элемент, которым управляет компонент.
- #### Методы:
- `addClass(className: string): void`: Добавляет класс к элементу.
- `removeClass(className: string): void`: Удаляет класс у элемента.
- `setText(text: string): void`: Устанавливает текст элемента.
- `toggleClass(className: string): void`: Переключает класс у элемента.
#### ProductList
Компонент для отображения списка товаров.
- #### Конструктор:
- `constructor(element: HTMLElement, products: Product[])`: Принимает элемент DOM для управления и массив товаров для отображения.
- #### Свойства:
- `element: HTMLElement`: DOM-элемент, которым управляет компонент.
- `products: Product[]`: Массив товаров для отображения.
- #### Методы:
- `render(products: Product[]): void`: Отображает список товаров.
#### ProductDetail
Компонент для отображения детальной информации о товаре.
- #### Конструктор:
- `constructor(element: HTMLElement, product: Product)`: Принимает элемент DOM для управления и объект товара для отображения.
- #### Свойства:
- `element: HTMLElement`: DOM-элемент, которым управляет компонент.
- `product: Product`: Объект товара для отображения.
- #### Методы:
- `render(product: Product): void`: Отображает информацию о товаре.

### ViewModels
#### ProductViewModel
ViewModel для соединения представлений с моделями и обработки логики UI.
- #### Конструктор:
- `constructor(productModel: ProductModel, eventEmitter: EventEmitter)`: Принимает объект модели товара и EventEmitter для управления событиями.
- #### Свойства:
- `productModel: ProductModel`: Модель товара.
- #### Методы:
- `fetchProducts(): Promise<void>`: Получает список товаров и вызывает событие `VIEW_PRODUCT`.
- `viewProduct(productId: string): void`: Вызывает событие `VIEW_PRODUCT` с информацией о товаре.
### Перечисление событий:
#### События корзины:
```
enum CartEvent {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  CHECKOUT = "CHECKOUT"
}
```
#### События товара:
```
enum ProductEvent {
  VIEW_PRODUCT = "VIEW_PRODUCT",
  CLOSE_PRODUCT_MODAL = "CLOSE_PRODUCT_MODAL"
}
```
