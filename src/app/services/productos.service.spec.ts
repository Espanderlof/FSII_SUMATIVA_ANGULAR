import { TestBed } from '@angular/core/testing';
import { ProductosService } from './productos.service';
import { provideHttpClient } from '@angular/common/http';

describe('ProductosService', () => {
  let service: ProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductosService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(ProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});