import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarmeComponent } from './registrarme.component';

describe('RegistrarmeComponent', () => {
  let component: RegistrarmeComponent;
  let fixture: ComponentFixture<RegistrarmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
