document.addEventListener('DOMContentLoaded', () => {
    const notesKey = 'local_notes';
    const notes = JSON.parse(localStorage.getItem(notesKey)) || [];

    // --- 1. Логика страницы создания (create.html) ---
    const createBtn = document.querySelector('.view'); // кнопка с классом view на странице создания
    if (createBtn && document.querySelector('.zagolovok')) {
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = document.querySelector('.zagolovok').value.trim();
            const body = document.querySelector('#text').value.trim();

            if (!title && !body) {
                alert('Please write something for your note!');
                return;
            }

            // Добавляем новую заметку в массив и сохраняем
            notes.push({ title: title || 'Untitled', body: body });
            localStorage.setItem(notesKey, JSON.stringify(notes));

            // Перекидываем на страницу со всеми заметками
            window.location.href = 'notes.html';
        });
    }

    // --- 2. Логика страницы со списком (notes.html) ---
    const notesGrid = document.getElementById('notes-grid');
    if (notesGrid) {
        // Если заметок нет, кидаем на главную
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
            // При клике на карточку — переходим на view.html с нужным индексом
            card.addEventListener('click', () => {
                window.location.href = `view.html?index=${index}`;
            });
            notesGrid.appendChild(card);
        });
    }

    // --- 3. Логика страницы просмотра (view.html) ---
    const viewInput = document.getElementById('input');
    const viewTextarea = document.getElementById('textarea');
    if (viewInput && viewTextarea) {
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get('index');

        if (index !== null && notes[index]) {
            viewInput.textContent = notes[index].title;
            viewTextarea.textContent = notes[index].body;
        } else {
            viewInput.textContent = 'Note not found';
            viewTextarea.textContent = '';
        }
    }
});

// Маленькая защита от XSS для чистоты
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  
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