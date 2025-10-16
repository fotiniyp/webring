// ============================================
// CONFIGURATION - ΠΡΟΣΘΕΣΤΕ ΤΑ ΜΕΛΗ ΕΔΩ
// ============================================

const members = [
  {
    id: 'marios',
    url: 'https://mstephanidhs.github.io/',
    name: 'Marios Stefanidis',
    icon: 'M',
  },
  {
    id: 'themis',
    url: 'https://themis-sar.github.io/jekyll-cv/',
    name: 'Themistoklis Sarantakos',
    icon: 'T',
  },
  {
    id: 'eleni',
    url: 'https://elenifot.github.io/My-CV/',
    name: 'Eleni Fotopoulou',
    icon: 'E'
  },
  {
    id: 'emmanouela',
    url: 'https://kayieni.github.io/',
    name: 'Emmanouela Vagianou',
    icon: 'EV'
  },
{
    id: 'fotini',
    url: '',
    name: 'Foteini Ypsilanti',
    icon: 'F'
  },
  // Προσθέστε νέα μέλη εδώ:
  // { id: 'maria', url: 'https://maria.github.io/cv', name: 'Μαρία Κ.', icon: 'Μ' }
];

// ============================================
// STATE MANAGEMENT
// ============================================

let currentIndex = -1; // -1 = list view

// ============================================
// INITIALIZATION
// ============================================

function init() {
  renderMembersList();

  // Έλεγχος για hash στο URL
  const hash = window.location.hash.substring(1);
  if (hash) {
    handleHashNavigation(hash);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderMembersList() {
  const grid = document.getElementById('membersGrid');
  grid.innerHTML = '';

  members.forEach((member, index) => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.onclick = () => showMember(index);

    card.innerHTML = `
          <div class="member-card-icon">${member.icon}</div>
          <h3>${member.name}</h3>
          <a href="${member.url}" onclick="event.stopPropagation();" target="_blank">
            ${member.url}
          </a>
        `;

    grid.appendChild(card);
  });
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function showList() {
  currentIndex = -1;
  document.getElementById('listView').classList.remove('hidden');
  document.getElementById('iframeContainer').classList.add('hidden');
  document.getElementById('memberInfoBar').classList.add('hidden');

  updateNavigationButtons();
  window.location.hash = '';
}

function showMember(index) {
  if (index < 0 || index >= members.length) return;

  currentIndex = index;
  const member = members[index];

  // Update UI
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('iframeContainer').classList.remove('hidden');
  document.getElementById('memberInfoBar').classList.remove('hidden');

  // Update iframe
  document.getElementById('cvFrame').src = member.url;

  // Update info bar
  document.getElementById('currentMemberName').textContent = member.name;
  document.getElementById('memberCounter').textContent = `(${index + 1} / ${
    members.length
  })`;
  document.getElementById('externalLink').href = member.url;

  // Update URL hash
  window.location.hash = member.id;

  updateNavigationButtons();
}

function navigatePrev() {
  if (currentIndex <= 0) {
    showMember(members.length - 1);
  } else {
    showMember(currentIndex - 1);
  }
}

function navigateNext() {
  if (currentIndex >= members.length - 1) {
    showMember(0);
  } else {
    showMember(currentIndex + 1);
  }
}

function navigateRandom() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * members.length);
  } while (randomIndex === currentIndex && members.length > 1);

  showMember(randomIndex);
}

function updateNavigationButtons() {
  const inListView = currentIndex === -1;

  document.getElementById('prevBtn').disabled = inListView;
  document.getElementById('nextBtn').disabled = inListView;
  document.getElementById('randomBtn').disabled = inListView;
}

// ============================================
// HASH NAVIGATION
// ============================================

function handleHashNavigation(hash) {
  if (!hash) {
    showList();
    return;
  }

  // Random
  if (hash === 'random') {
    navigateRandom();
    return;
  }

  // Next/Prev
  if (hash.startsWith('next-')) {
    const memberId = hash.substring(5);
    const index = members.findIndex((m) => m.id === memberId);
    if (index !== -1) {
      const nextIndex = (index + 1) % members.length;
      showMember(nextIndex);
    }
    return;
  }

  if (hash.startsWith('prev-')) {
    const memberId = hash.substring(5);
    const index = members.findIndex((m) => m.id === memberId);
    if (index !== -1) {
      const prevIndex = (index - 1 + members.length) % members.length;
      showMember(prevIndex);
    }
    return;
  }

  // Direct member ID
  const index = members.findIndex((m) => m.id === hash);
  if (index !== -1) {
    showMember(index);
  }
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  handleHashNavigation(window.location.hash.substring(1));
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function handleKeyboard(e) {
  if (currentIndex === -1) return; // Μόνο στο viewer mode

  switch (e.key) {
    case 'ArrowLeft':
      navigatePrev();
      break;
    case 'ArrowRight':
      navigateNext();
      break;
    case 'r':
    case 'R':
      navigateRandom();
      break;
    case 'Escape':
      showList();
      break;
  }
}

// ============================================
// START
// ============================================

init();
