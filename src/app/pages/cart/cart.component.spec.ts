import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// craamos una nueva variable que sera utilizada por varios test (getTotalAmount)
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


    //public getTotalPrice(listCartBook: Book[]): number {
    //let totalPrice = 0;
    //listCartBook.forEach((book: Book) => {
    //   totalPrice += book.amount * book.price;
    //   });
    //return totalPrice;
    //}

});