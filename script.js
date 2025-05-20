let words = [];
let currentIndex = 0;
const container = document.getElementById('flashcard-container');
const dateFilter = document.getElementById('dateFilter');

function toggleVisibility(button) {
  const text = button.nextElementSibling;
  const isShown = text.style.display === 'block';
  text.style.display = isShown ? 'none' : 'block';
  button.textContent = button.textContent.replace(isShown ? 'Hide' : 'View', isShown ? 'View' : 'Hide');
}

function renderCard(index) {
  container.innerHTML = '';
  if (words.length === 0) return;

  const entry = words[index];
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2>${entry.word}</h2>

    <div class="section">
      <button class="view-btn" onclick="toggleVisibility(this)">View Meaning</button>
      <div class="text-content">${entry.meaning}</div>
    </div>

    <div class="section">
      <button class="view-btn" onclick="toggleVisibility(this)">View Synonyms</button>
      <div class="text-content">${entry.synonyms.join(', ')}</div>
    </div>

    <div class="section">
      <button class="view-btn" onclick="toggleVisibility(this)">View Antonyms</button>
      <div class="text-content">${entry.antonyms.join(', ')}</div>
    </div>
  `;

  container.appendChild(card);
}

function updateButtons() {
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').disabled = currentIndex === words.length - 1;
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentIndex < words.length - 1) {
    currentIndex++;
    renderCard(currentIndex);
    updateButtons();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard(currentIndex);
    updateButtons();
  }
});

document.getElementById('showAll').addEventListener('click', () => {
  // 1. Reset the date input
  document.getElementById('datePicker').value = '';

  // 2. Reset the filtered list to show all words
  words = [...allWords];
  currentIndex = 0;

  // 3. Re-render the first card and update navigation buttons
  renderCard(currentIndex);
  updateButtons();
});



document.getElementById('randomize').addEventListener('click', () => {
  words = [...words].sort(() => Math.random() - 0.5);
  currentIndex = 0;
  renderCard(currentIndex);
  updateButtons();
});

dateFilter.addEventListener('change', () => {
  const filtered = allWords.filter(w => w.date === dateFilter.value);
  words = filtered;
  currentIndex = 0;
  renderCard(currentIndex);
  updateButtons();
});

let allWords = [];

fetch('data/words.json')
  .then(res => res.json())
  .then(data => {
    allWords = data;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter the words based on today's date
    words = allWords.filter(word => word.date === today);

    // Set the date picker value to today's date
    document.getElementById('datePicker').value = today;

    // Render the card
    currentIndex = 0;
    renderCard(currentIndex);
    updateButtons();
  });

