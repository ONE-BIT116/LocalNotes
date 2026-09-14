document.addEventListener('DOMContentLoaded', () => {
    const NOTES_KEY = 'local_notes';

    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (toggleBtn) {
        toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        toggleBtn.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

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

    const notesGrid = document.getElementById('notes-grid');
    const createBtn = document.querySelector('.view');
    const createTitleInput = document.querySelector('.zagolovok');

    const blacklist = ['create.html', 'view.html', 'edit.html'];
    const isBlacklisted = blacklist.some(page => window.location.pathname.endsWith(page));

    const isIndexPage = !isBlacklisted && !notesGrid && (createBtn || createTitleInput || window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'));

    if (isIndexPage) {
        const initialNotes = getNotes();
        if (Array.isArray(initialNotes) && initialNotes.length > 0) {
            window.location.href = 'notes.html';
            return;
        }
    }

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

    const viewInput = document.getElementById('input');
    const viewTextarea = document.getElementById('textarea');

    if (viewInput && viewTextarea) {
        const notes = getNotes();
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get('index');

        if (index !== null && notes[index]) {
            viewInput.textContent = notes[index].title;
            viewTextarea.textContent = notes[index].body;

            const editLink = document.querySelector('.editing');
            if (editLink) {
                editLink.href = `edit.html?index=${index}`;
            }
        } else {
            viewInput.textContent = 'Note not found';
            viewTextarea.textContent = '';
        }
    }

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

    const deleteButton = document.getElementById('delete-btn');

    if (deleteButton) {
        const index = Number(new URLSearchParams(window.location.search).get('index'));
        const notesToDelete = getNotes();

        deleteButton.addEventListener('click', () => {
            notesToDelete.splice(index, 1);
            saveNotes(notesToDelete);
            window.location.href = 'index.html';
        });
    }
});