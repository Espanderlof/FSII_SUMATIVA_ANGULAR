import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactoComponent } from './contacto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ContactoComponent', () => {
  let component: ContactoComponent;
  let fixture: ComponentFixture<ContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.contactForm.get('nombre')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('celular')?.value).toBe('');
    expect(component.contactForm.get('asunto')?.value).toBe('');
    expect(component.contactForm.get('mensaje')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.contactForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      nombre: 'Test',
      email: 'test@test.com',
      celular: '123456789',
      asunto: 'Test Asunto',
      mensaje: 'This is a test message'
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate celular format', () => {
    const celularControl = component.contactForm.get('celular');
    celularControl?.setValue('12345');
    expect(celularControl?.valid).toBeFalsy();
    
    celularControl?.setValue('123456789');
    expect(celularControl?.valid).toBeTruthy();
  });

  it('should set submitted to true on form submission', () => {
    expect(component.submitted).toBeFalsy();
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
  });

  it('should reset form and submitted status after successful submission', () => {
    const form = component.contactForm;
    form.patchValue({
      nombre: 'Test',
      email: 'test@test.com',
      celular: '123456789',
      asunto: 'Test Asunto',
      mensaje: 'This is a test message'
    });
    
    spyOn(window, 'alert');
    component.onSubmit();
    
    expect(window.alert).toHaveBeenCalledWith('¡Mensaje enviado correctamente!');
    expect(form.pristine).toBeTruthy();
    expect(component.submitted).toBeFalsy();
  });

});