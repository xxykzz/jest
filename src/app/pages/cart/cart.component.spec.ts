import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { ComponentFactory, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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
        // instanciamos el componente desde el fixture
        component = fixture.componentInstance;
        // con esto entrara por el metodo onInit, y realizara lo que hace en el onInit
        fixture.detectChanges();
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

    //test a metodos SIN RETURN (SPYON) 
    // public onInputNumberChange(action: string, book: Book): void {
    // const amount = action === 'plus' ? book.amount + 1 : book.amount - 1;
    // book.amount = Number(amount);
    // this.listCartBook = this._bookService.updateAmountBook(book);
    // this.totalPrice = this.getTotalPrice(this.listCartBook);

    it('Deberia calcular correctamente el numero de items en el carrito (onInputNumberChange)', () => {
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

        // llamamos al metodo que estamos testeando
        component.onInputNumberChange(action, book)

        // creamos el expect SOBRE LOS SPY mediante el metodo 'toHaveBeenCalled()'
        expect(spyOne).toHaveBeenCalled();
        // podemos utilizar para contabilizar las veces que se llamo a un metodo con 'toHaveBeenCalledTimes()'
        expect(spyTwo).toHaveBeenCalledTimes(1);

    })
  }
    

);