import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @description
 * Componente para manejar el formulario de contacto
 */
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent implements OnInit {
  /** Formulario de contacto */
  contactForm!: FormGroup;
  /** Indica si el formulario ha sido enviado */
  submitted = false;

  /**
   * Constructor del componente
   * @param formBuilder Servicio para construir formularios reactivos
   */
  constructor(private formBuilder: FormBuilder) { }

  /**
   * Inicializa el componente y configura el formulario
   */
  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      alert('¡Mensaje enviado correctamente!');
      this.contactForm.reset();
      this.submitted = false;
    }
  }
  
  /**
   * Getter para acceder fácilmente a los controles del formulario
   * @returns Los controles del formulario
   */
  get f() { return this.contactForm.controls; }
}
