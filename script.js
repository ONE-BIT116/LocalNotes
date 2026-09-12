document.addEventListener('DOMContentLoaded', () => {
    const NOTES_KEY = 'local_notes';

    function getNotes() {
        return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
    }

    function saveNotes(notes) {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // ============================================================
    // 1. СТРАНИЦА СОЗДАНИЯ (create.html)
    //    поля: .zagolovok (заголовок), #text (текст), .view (кнопка)
    // ============================================================
    const createBtn = document.querySelector('.view');
    const createTitleInput = document.querySelector('.zagolovok');

    if (createBtn && createTitleInput) {
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const title = createTitleInput.value.trim();
            const body = document.querySelector('#text').value.trim();

            if (!title && !body) {
                alert('Please write something for your note!');
                return;
            }

            const notes = getNotes();
            notes.push({
                title: title || 'Untitled',
                body: body,
                date: new Date().toISOString()
            });
            saveNotes(notes);

            window.location.href = 'notes.html';
        });
    }

    // ============================================================
    // 2. СПИСОК ЗАМЕТОК (notes.html)
    //    контейнер: #notes-grid
    // ============================================================
    const notesGrid = document.getElementById('notes-grid');

    if (notesGrid) {
        const notes = getNotes();

        if (notes.length === 0) {
            window.location.href = 'index.html';
            return;
        }

        notesGrid.innerHTML = '';

        notes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <h3>${escapeHtml(note.title)}</h3>
                <p>${escapeHtml(note.body.substring(0, 80))}${note.body.length > 80 ? '...' : ''}</p>
            `;

            card.addEventListener('click', () => {
                window.location.href = `view.html?index=${index}`;
            });

            notesGrid.appendChild(card);
        });
    }

    // ============================================================
    // 3. ПРОСМОТР ЗАМЕТКИ (view.html)
    //    поля: #input (заголовок), #textarea (текст)
    //    ссылка редактирования: <a class="editing" href="edit.html">
    // ============================================================
    const viewInput = document.getElementById('input');
    const viewTextarea = document.getElementById('textarea');

    if (viewInput && viewTextarea) {
        const notes = getNotes();
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get('index');

        if (index !== null && notes[index]) {
            viewInput.textContent = notes[index].title;
            viewTextarea.textContent = notes[index].body;

            // Подставляем правильный индекс в ссылку Edit
            const editLink = document.querySelector('.editing');
            if (editLink) {
                editLink.href = `edit.html?index=${index}`;
            }
        } else {
            viewInput.textContent = 'Note not found';
            viewTextarea.textContent = '';
        }
    }

    // ============================================================
    // 4. РЕДАКТИРОВАНИЕ ЗАМЕТКИ (edit.html)
    //    поля: #inputtt (заголовок), #textareaaa (текст)
    //    кнопка: .confirm-btn
    // ============================================================
    const inputTitle = document.getElementById('inputtt');
    const textBody = document.getElementById('textareaaa');
    const confirmBtn = document.querySelector('.confirm-btn');

    if (inputTitle && textBody && confirmBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const editIndex = urlParams.get('index');

        let notes = getNotes();

        if (editIndex !== null && notes[editIndex]) {
            inputTitle.value = notes[editIndex].title || '';
            textBody.value = notes[editIndex].body || '';
        }

        confirmBtn.addEventListener('click', () => {
            const title = inputTitle.value.trim();
            const content = textBody.value.trim();

            if (!title && !content) return;

            const newNote = {
                title: title || 'Untitled',
                body: content,
                date: new Date().toISOString()
            };

            if (editIndex !== null && notes[editIndex]) {
                notes[editIndex] = newNote;
            } else {
                notes.push(newNote);
            }

            saveNotes(notes);
            window.location.href = 'notes.html';
        });
    }

    // ============================================================
    // 5. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (работает на любой странице)
    // ============================================================
    const toggleBtn = document.getElementById('theme-toggle');

    if (toggleBtn) {
        const currentTheme = localStorage.getItem('theme') || 'light';

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleBtn.textContent = '☀️';
        }

        toggleBtn.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');

            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                toggleBtn.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleBtn.textContent = '☀️';
            }
        });
    }
});