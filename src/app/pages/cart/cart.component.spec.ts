import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// craamos un mock para utilizar en nuestros tests
const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 7,
    }
]

// -------------------------------------------------CONFIGURACION DE LA SUITE--------------------------------------------------------

// declaramos el componente dentro del describe
describe('cart component', () => {
    // creamos la variable del componente
    let component: CartComponent;
    // creamos el fixture del componente, con esto podemos traer el servicio del componente 'cart component', con esto
    // extraemos metodos y variables del componente
    let fixture: ComponentFixture<CartComponent>
    //creamos los eventos de este archvo spec, ejemplo: beforeEach
    //se ejecuta antes de cada test
    beforeEach(() => {
        // aqui dentro podremos configurar el testbed con el metodo 'configureTestingModule', este nos pide un objeto
        // este objeto confugration , necesita varios parametros (imports, exports, providers), similar a los modulos de nuestra app
        TestBed.configureTestingModule({
            // aqui ponemos los MODULOS que necesitamos para quye funcionenuestro componente
            // en este caso va el httpClientTestingModule, lo utilizaremos en casi todos los test, esto es en este caso por el 
            // servicio injectado en el cartComponent, utilizamos el modulo de testing para no realizar peticiones reales
            imports: [HttpClientTestingModule],
            // aca ponemos el COMPONENTE que utilizamos en nuestro test
            declarations: [CartComponent],
            // aca ponemos los SERVICIOS que utiliza nuestro component, en este caso el servicio injectado en cart component(bookService)
            providers: [BookService],
            // agregar y averiguar
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
            //con esta linea permitimos la compilacion de los componentes
        }).compileComponents();
    })

    // creamos un segundo beforeEach para instanciar el component
    beforeEach(() => {
        // instanciamos el componente y lo extraemos del testBed , crea el componente con la funcion createComponent que recibe como parametro el tipo
        // del componente que creara
        fixture = TestBed.createComponent(CartComponent);
        // injectamos el servicio antes de cada test
        const service =  fixture.debugElement.injector.get(BookService);
        // instanciamos el componente desde el fixture
        component = fixture.componentInstance;
        // con esto entrara por el metodo onInit, y realizara lo que hace en el onInit
        fixture.detectChanges();
        // agregamos los espias necesarios para los metodos que se ejecutan en el ciclo de vida onInit de nuestro componente
        // en este caso retornaremos del metodo del servicio getBooksFromCart nuestra listBook declarada previamente
        // metodo onInit: 
        // ngOnInit(): void {
        // this.listCartBook = this._bookService.getBooksFromCart();
        // this.totalPrice = this.getTotalPrice(this.listCartBook);
        // getBooksFromCart es reemplazado por '() => listBook'
        jest.spyOn(service, 'getBooksFromCart').mockImplementation(() => listBook);
    })

    afterEach( () => {
        // destruye la instancia del testbed
        fixture.destroy();
        // resetea los mocks luego de cada test
        jest.resetAllMocks();
    })

    // primer test, chequeamos que se este instanciando el componente
    it('should create', () => {
        expect(component).toBeTruthy();
    })

    //test a metodos CON RETURN (getTotalPrice)
    it('debera retornar el total price y ammount',() => {
        //esta constante la declaramos al inicio de este fichero, ya que el metodo getTotalPrice 
        //nos solicita como parametro un array de books del tipo: Book[]
        //guardamos la llamada el metodo dentro de una constante
        const totalPrice = component.getTotalPrice(listBook);
        //aca esperamos el resultado del metodo que llamamos desde nuestra instancia del componente
        expect(totalPrice).toBeGreaterThan(0);
        // otra forma de probarlo, que no sea 0
        expect(totalPrice).not.toBe(0);
        //probar que no sea nulo
        expect(totalPrice).not.toBeNull();
    })

    // ----------------------------------------------------METODOS SIN RETURN------------------------------------

    it('Deberia aumentar correctamente el numero de items en el carrito (onInputNumberChange)', () => {
        // declaramos el primer parametro que nos pide la funcion 
        const action = 'plus';
        // declaramos el segundo parametro que nos solicita la funcion
        const book: Book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2,
        };
        // declaramos una constante que nos dara acceso al servicio privado y sus metodos dentro del test 
        // version superior a angular 9
        const service =  fixture.debugElement.injector.get(BookService);
        //version anterior a angular 9
        // -------------------------------------------------------------------------------------------------
        // const serviceDos = TestBed.get(BookService)
        // si lo fueramos a utilizar varias veces podriamos declarar fuera del test de forma global en el beforeEach

        // creando el primer espia:
        // el metodo spyOn recibe dos prametros, el primero sera el nombre del servicio / comonente a espiar
        // y el segundo sera el nombre del metodo a espiar.
        // el metodo spyOn nos permite acceder a sus funciones mediante la sintaxis de punto y accederemos al metodo llamado
        // mockImplementation(), este metodo recibira como parametro una funcion anonima que sera la que se ejecutara
        // al llamar al metodo 'updateAmountBook' que se encuentra dentro del metodo que estamos probando en este ut
        // de esta forma nos aseguramos que el metodo haya sido llamado.
        const spyOne = jest.spyOn(service, 'updateAmountBook').mockImplementation(() => null);
        
        // realizamos un nuevo spyOn sobre el siguiente metodo que utiliza onInputNumberChange
        // como el metodo que estamos espiando en este caso, SI esta dentro de nuestro component instanciado
        // no necesitamos pasarle el servicio injectado, sino solo component.
        const spyTwo = jest.spyOn(component, 'getTotalPrice').mockImplementation(() => null);
        // chequeamos la cantidad inicial de book
        expect(book.amount).toBe(2);
        // llamamos al metodo que estamos testeando
        component.onInputNumberChange(action, book)
        // chequeamos la cantidad luego de llamar al metodo que aumenta la cantidad de book
        expect(book.amount).toBe(3);
        
        // creamos el expect SOBRE LOS SPY mediante el metodo 'toHaveBeenCalled()'
        expect(spyOne).toHaveBeenCalled();
        // podemos utilizar para contabilizar las veces que se llamo a un metodo con 'toHaveBeenCalledTimes()'
        expect(spyTwo).toHaveBeenCalledTimes(1);

    })

    // creamos el mismo test para la casuistica decremental
    it('Deberia decrementar correctamente el numero de items en el carrito (onInputNumberChange)', () => { 
        const action = 'minus';
        const book: Book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2,
        };

        const service =  fixture.debugElement.injector.get(BookService);

        const spyOne = jest.spyOn(service, 'updateAmountBook').mockImplementation(() => null);
        const spyTwo = jest.spyOn(component, 'getTotalPrice').mockImplementation(() => null);
        expect(book.amount).toBe(2);
        
        component.onInputNumberChange(action, book)
        expect(book.amount).toBe(1);
        
        expect(spyOne).toHaveBeenCalled();
        expect(spyTwo).toHaveBeenCalledTimes(1);

    })

    // test a metodo que llama a METODO PRIVADO
    it('el componente realiza la llamada correctamente(onClearCart)', () => {
        // creamos el espia para el metodo que es llamado en el metodo privado
        const service =  fixture.debugElement.injector.get(BookService);
        const spy = jest.spyOn(service, 'removeBooksFromCart').mockImplementation(() => null)
        // creamos el espia para el metodo propio del componente sin simular el mock, en este caso no nos interesa tener una
        // implementacion mock
        const spyTwo = jest.spyOn(component as any, '_clearListCartBook');
        // inicializamos la variable que necesita el componente en el metodo onClearBook
        component.listCartBook = listBook;
        // realizamos la llamada al metodo
        component.onClearBooks();
        // esperamos que el metodo que mockeamos dentro de spy sea llamado una vez
        expect(spy).toBeCalledTimes(1)
        expect(spyTwo).toBeCalledTimes(1)
        // esperamos que el metodo haya funcionado correctamente, recordemos que solo testearemos los metodos
        // nativos de cada componente, y no asi los que son llamados dentro del componente.
        expect(component.listCartBook.length).toBe(0);
    })

    // test SOBRE el metodo privado
    it('comprueba el llamado probando SOBRE el metodo privado', () => {
        const service =  fixture.debugElement.injector.get(BookService);
        const spy = jest.spyOn(service, 'removeBooksFromCart').mockImplementation(() => null)
        component.listCartBook = listBook;
        // accedemos al metodo privado mediante la sintaxis de [""]()
        component["_clearListCartBook"]();

        expect(component.listCartBook.length).toBe(0);
        expect(spy).toHaveBeenCalledTimes(1);
    })    
  }
);