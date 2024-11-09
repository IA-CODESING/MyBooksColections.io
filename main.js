class Libro{
    constructor(titulo, autor, isbn){
        this.autor = autor;
        this.titulo = titulo;
        this.isbn = isbn;
    }
}

class UI{
    static mostrarLibros(){
        const libros = Datos.traerLibros();
        libros.forEach((libro) => {
            UI.agregarLibroLista(libro)
        })
    }

    // Recibe un objeto de la clase Libro
    static agregarLibroLista(libro){
        const lista = document.querySelector('#libro-list');
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        lista.appendChild(fila);
    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        };
    }

    static mostrarAlerta(mensaje, className){
        // Creamos el div de la alerta
        const div = document.createElement('div');
        // Asignamos el mensaje al div de alerta
        div.className = `alert alert-${className}`;
        // asignamos al nodo el div del mensaje y la alerta
        div.appendChild(document.createTextNode(mensaje));


        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');

        // asignamos a nuestro contenedor los div de nuestra alerta
        container.insertBefore(div, form);

        // creamos funcion para que se elimine la alerta despues de un tiempo
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Datos{
    static traerLibros(){
        let libros;
        // validamos si hay o no entrada de datos para agregar el objeto
        if(localStorage.getItem('libros') === null){
            libros = [];
        }else{
            // si hay entradas lo devolvemos como un JSON
            libros = JSON.parse(localStorage.getItem('libros'));
        };
        return libros;
    }

    static agregarLibro(libro){
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn){
        const libros = Datos.traerLibros();
            libros.forEach((libro, index) => {
                if(libro.isbn === isbn){
                    libros.splice(index, 1);
                }
            });
            localStorage.setItem('libros', JSON.stringify(libros));
    }
}

// Carga de l apagina, capturamos los datos del dom y vamos a modificar o crear toda la interdaz a mostrarlibros()
document.addEventListener('DOMContentLoaded', UI.mostrarLibros());



// Controlar evento submit
document.querySelector('#libro-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores de campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    if(!titulo || !autor || !isbn ){
        UI.mostrarAlerta(`Por favor ingresar todos los datos...`, 'danger');
    }else{
        const libro = new Libro(titulo, autor, isbn);
        Datos.agregarLibro(libro);
        UI.agregarLibroLista(libro);
        UI.mostrarAlerta('Libro agregado a la coleccion', 'success');
        UI.limpiarCampos();
    }
});

document.querySelector('#libro-list').addEventListener('click', (e) => {
    UI.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Libro Eliminado correctamente...', 'success')
});