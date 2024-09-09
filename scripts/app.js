let $formAdd = document.querySelector('#form-add');
let $search = document.querySelector('#search');
let $filterPending = document.querySelector('#filter-pending');
let $notesContainer = document.querySelector('#notes-container');

// Cargar notas del localStorage o inicializar un array vacío
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Función para guardar las notas en localStorage
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Cargar notas al iniciar
function loadNotesFromLocalStorage() {
    notes.forEach(note => addNoteToDOM(note));
}

// Evento al enviar el formulario para agregar una nueva nota
$formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = event.target['title'].value;
    let description = event.target['description'].value;

    // Generar un ID único para la nueva nota
    let id = Date.now();

    // Crear la nueva nota
    let note = newNote(id, title, description, false);

    // Agregar la nueva nota al array de notas
    notes.push(note);

    // Añadir la nota al DOM
    addNoteToDOM(note);

    // Guardar las notas en el localStorage
    saveNotesToLocalStorage();

    // Limpiar el formulario después de agregar la nota
    event.target.reset();
});

function newNote(id, title, description, state = false) {
    return {
        id,
        title,
        description,
        state
    };
}

// Función para añadir la nota al DOM
function addNoteToDOM(note) {
    // Crear un nuevo elemento de artículo para la nota
    let noteElement = document.createElement('article');
    noteElement.classList.add('flex', 'flex-col', 'bg-emerald-400', 'gap-2', 'border', 'rounded', 'w-11/12', 'h-full', 'p-5', 'relative');

    // Determinar el texto y la clase de color del estado de la nota
    let statusText = note.state ? 'Done' : 'Pending';
    let statusColorClass = note.state ? 'text-green-700' : 'text-red-700';

    // Crear contenido de la nota usando la estructura HTML proporcionada
    noteElement.innerHTML = `
        <h3 class="text-2xl">${note.title}</h3>
        <p class="text-lg">${note.description}</p>
        <button class="bg-white p-1 rounded absolute top-2 right-2" onclick="deleteNote(${note.id})">❌</button>
        <label class="cursor-pointer bg-white px-4 py-1 text-xl rounded self-center ${statusColorClass}" for="status-${note.id}">${statusText}</label>
        <input type="checkbox" class="hidden" name="note-status" id="status-${note.id}" ${note.state ? 'checked' : ''} onchange="togglePending(${note.id})">
    `;

    // Añadir la nota al contenedor
    $notesContainer.appendChild(noteElement);
}

// Función para eliminar la nota
function deleteNote(id) {
    // Filtra la nota por su ID y actualiza el array
    notes = notes.filter(note => note.id !== id);

    // Actualiza el localStorage
    saveNotesToLocalStorage();

    // Limpia el contenedor y vuelve a pintar las notas restantes
    renderNotes();
}

// Función para marcar la nota como pendiente
function togglePending(id) {
    // Encuentra la nota por su ID y cambia su estado
    notes = notes.map(note => {
        if (note.id === id) {
            note.state = !note.state;
        }
        return note;
    });

    // Actualiza el localStorage
    saveNotesToLocalStorage();

    // Limpia el contenedor y vuelve a pintar las notas actualizadas
    renderNotes();
}

// Función para renderizar las notas filtradas o buscadas
function renderNotes() {
    $notesContainer.innerHTML = '';
    const searchText = $search.value.toLowerCase();
    const filterPending = $filterPending.checked;

    notes
        .filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchText);
            const matchesFilter = filterPending ? !note.state : true;
            return matchesSearch && matchesFilter;
        })
        .forEach(note => addNoteToDOM(note));
}

// Event listeners para buscar y filtrar
$search.addEventListener('input', renderNotes);
$filterPending.addEventListener('change', renderNotes);

// Cargar notas del localStorage al cargar la página
loadNotesFromLocalStorage();
