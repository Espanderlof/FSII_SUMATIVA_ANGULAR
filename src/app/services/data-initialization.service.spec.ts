import { TestBed } from '@angular/core/testing';
import { DataInitializationService } from './data-initialization.service';
import { provideHttpClient } from '@angular/common/http';

describe('DataInitializationService', () => {
  let service: DataInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataInitializationService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(DataInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});