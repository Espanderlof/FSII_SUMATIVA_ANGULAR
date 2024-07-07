import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JsonService } from './json.service';


describe('AuthService', () => {
  let service: AuthService;
  let jsonServiceSpy: jasmine.SpyObj<JsonService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('JsonService', ['getData', 'setData']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: JsonService, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    jsonServiceSpy = TestBed.inject(JsonService) as jasmine.SpyObj<JsonService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});