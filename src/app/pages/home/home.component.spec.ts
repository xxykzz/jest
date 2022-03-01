import { HomeComponent } from "./home.component";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from '../cart/cart.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { compileNgModuleDeclarationExpression } from "@angular/compiler/src/render3/r3_module_compiler";
import { Book } from "src/app/models/book.model";
import { of } from "rxjs";

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

// creamos el describe
describe('Home component', () => {
    // declaramos el componente
    let component: HomeComponent;
    // declaramos el fixture
    let fixture: ComponentFixture<HomeComponent>;

    // creamos el beforeEach
    beforeEach( () => {
        // Creamos el TestBed
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [CartComponent],
            providers: [BookService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
        
    })

    // instanciamos el componente con la configuracion del testbed
    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    // test de creacion del componente
    it('Deberia crearse', () => {
        expect(component).toBeTruthy();
    })

    // creamos el test para el suscribe, obtenemos libros desde la suscripcion
    it('getBook obtiene libro desde la suscripcion', () => {
        // inyectamos el servicio que utiliza el suscribe dentro de una variable
        const bookService = fixture.debugElement.injector.get(BookService);
        // creamos el espia para el bookService
        // hacemos uso del metodo 'mockReturnValueOnce' que nos retornara lo que le pasamos por parametro
        // en el caso de los suscribe, ya que retornan observables, debemos pasarle el metodo 'of', para que sepa que tiene que retornar
        // el observable de listBook como respuesta.
        const spyOne = jest.spyOn(bookService, 'getBooks').mockReturnValueOnce(of (listBook))
        component.getBooks();
        // testeamos que el metodo getBooks sea llamado
        expect(spyOne).toHaveBeenCalledTimes(1);
        // probamos que la cantidad de libros dentro del listBook sea igual a nuestra lista
        expect(component.listBook.length).toBe(3);
        // podemo tambien comparar con el metodo toEqual para comparar objetosss
        expect(component.listBook).toEqual(listBook);
    })

})