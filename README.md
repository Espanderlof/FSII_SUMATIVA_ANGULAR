# FSII_SUMATIVA_ANGULAR
FSII - SUMATIVA - ANGULAR

DOCKER COMANDOS
- docker build -t albavets .
- docker run -p 80:80 albavets

--------------------------------------------------------------------------

COMPODOC COMANDOS
- Comando para generar documentacion: npx compodoc -p tsconfig.json
- Comando para levantar servidor de documentacion: compodoc -s

COMPODOC DECLARACIONES
- @description | Se utiliza para proporcionar una descripción general del componente.
    /**
    * @description Se ingresa la descripcion del componente
    */

- @param | Se utiliza para describir los parámetros de una función o método. Proporciona detalles sobre el tipo de datos, el propósito y cualquier restricción asociada al parámetro.
    /**
   * Constructor del componente
   * @param cartService Servicio para manejar el carrito
   * @param authService Servicio de autenticación
   * @param dataInitService Servicio de inicialización de datos
   */

- @return | Describe el valor de retorno de una función o método. Proporciona detalles sobre el tipo de datos y el significado del valor devuelto.
  /**
   * Método para verificar si el usuario es administrador
   * @returns {boolean} Verdadero si el usuario es administrador, falso en caso contrario
   */

- @usageNotes | Se utiliza para proporcionar ejemplos de uso del módulo. Cuando documentas tus componentes, directivas, servicios o cualquier otro elemento en TypeScript con JSDoc, puedes incluir secciones personalizadas para proporcionar notas de uso.
  /**
   * @description Prueba: No debería iniciar sesión con una contraseña incorrecta
   * @usageNotes 
   * Esta prueba verifica el manejo de credenciales inválidas
   * 
   * 1. Rellena el formulario con un email correcto pero una contraseña incorrecta.
   * 2. Verifica que el formulario sea válido.
   * 3. Simula una respuesta fallida del servicio de autenticación.
   * 4. Espía la función alert del navegador.
   * 5. Llama al método onSubmit().
   * 6. Verifica que se haya llamado al servicio de login con las credenciales proporcionadas.
   * 7. Comprueba que no se haya llamado a la navegación.
   * 8. Verifica que se haya mostrado el mensaje de alerta correcto.
  */
