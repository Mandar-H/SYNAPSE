(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Removed hero tabs and text tools; cleanup of related logic

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Theme toggle with persistence
  const themeBtn = document.getElementById('theme-toggle');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const storedTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) || '';
  function applyTheme(theme) {
    document.body.classList.toggle('theme-light', theme === 'light');
    if (themeBtn) {
      themeBtn.textContent = theme === 'light' ? 'Dark' : 'Light';
      // Set data-next to indicate which theme will be applied on next click
      const next = theme === 'light' ? 'dark' : 'light';
      themeBtn.setAttribute('data-next', next);
    }
  }
  const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');
  applyTheme(initialTheme);
  if (themeBtn) {
    // Initialize icon based on next theme action
    themeBtn.setAttribute('data-next', document.body.classList.contains('theme-light') ? 'dark' : 'light');
    themeBtn.addEventListener('click', function() {
      const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      themeBtn.classList.add('theme-flip');
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (_) {}
      setTimeout(() => themeBtn.classList.remove('theme-flip'), 650);
    });
  }

  // Global button press feedback for smoother interactions
  document.addEventListener('mousedown', (e) => {
    const btn = e.target && e.target.closest && e.target.closest('.btn');
    if (btn) btn.classList.add('is-pressed');
  });
  document.addEventListener('mouseup', (e) => {
    const btn = e.target && e.target.closest && e.target.closest('.btn');
    if (btn) btn.classList.remove('is-pressed');
  });
  document.addEventListener('mouseleave', (e) => {
    const btn = e.target && e.target.closest && e.target.closest('.btn');
    if (btn) btn.classList.remove('is-pressed');
  }, true);

  // Signup form validation and success flow
  const form = document.getElementById('signup-form');
  if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsInput = document.getElementById('terms');
    const submitBtn = document.getElementById('signup-submit');
    const successBox = document.getElementById('signup-success');

    function setError(input, messageEl, message) {
      if (!input || !messageEl) return;
      input.classList.add('input-error');
      messageEl.textContent = message;
    }

    function clearError(input, messageEl) {
      if (!input || !messageEl) return;
      input.classList.remove('input-error');
      messageEl.textContent = '';
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      let valid = true;
      const nameErr = document.getElementById('error-name');
      const emailErr = document.getElementById('error-email');
      const passErr = document.getElementById('error-password');

      if (!nameInput.value.trim()) { valid = false; setError(nameInput, nameErr, 'Please enter your full name'); } else { clearError(nameInput, nameErr); }
      if (!emailInput.value.trim()) { valid = false; setError(emailInput, emailErr, 'Email is required'); }
      else if (!validateEmail(emailInput.value.trim())) { valid = false; setError(emailInput, emailErr, 'Enter a valid email'); } else { clearError(emailInput, emailErr); }
      if (!passwordInput.value) { valid = false; setError(passwordInput, passErr, 'Password is required'); }
      else if (passwordInput.value.length < 8) { valid = false; setError(passwordInput, passErr, 'Password must be at least 8 characters'); } else { clearError(passwordInput, passErr); }
      if (!termsInput.checked) { valid = false; }
      return valid;
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.classList.toggle('is-loading', isLoading);
      submitBtn.disabled = isLoading;
    }

    ['input', 'blur', 'change'].forEach(evt => {
      [nameInput, emailInput, passwordInput, termsInput].forEach(el => el && el.addEventListener(evt, () => validate()));
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (successBox) {
          successBox.classList.add('active');
          form.style.display = 'none';
        }
        setTimeout(() => { window.location.href = 'index.html'; }, 1400);
      }, 900);
    });
  }

  // Drag & Drop for Build on Synapse dropzone
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('dropzone-list');
  function bytesToKB(bytes) { return Math.max(1, Math.round(bytes / 1024)); }
  function getStoredFiles() {
    try { return JSON.parse(localStorage.getItem('dropzoneFiles') || '[]'); } catch (_) { return []; }
  }
  function setStoredFiles(list) {
    try { localStorage.setItem('dropzoneFiles', JSON.stringify(list)); } catch (_) {}
  }
  function normalizeFiles(files) {
    return Array.from(files).map(f => ({ name: f.name, size: f.size }));
  }
  function renderFilesList(list) {
    if (!fileList) return;
    fileList.innerHTML = '';
    list.forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item';
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = file.name;
      const size = document.createElement('span');
      size.className = 'size';
      size.textContent = ` (${bytesToKB(file.size)} KB)`;
      const remove = document.createElement('button');
      remove.className = 'btn btn-ghost remove-file';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('data-name', file.name);
      item.appendChild(name);
      item.appendChild(size);
      item.appendChild(remove);
      fileList.appendChild(item);
    });
  }
  function setFilesAndRender(files) {
    const incoming = normalizeFiles(files);
    const existing = getStoredFiles();
    // Merge by file name; keep the latest entry for duplicates
    const map = new Map();
    existing.forEach(f => map.set(f.name, f));
    incoming.forEach(f => map.set(f.name, f));
    const merged = Array.from(map.values());
    setStoredFiles(merged);
    renderFilesList(merged);
  }
  function openPicker() { if (fileInput) fileInput.click(); }
  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
  if (dropzone) {
    ['dragenter','dragover','dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, preventDefaults));
    ['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, () => dropzone.classList.add('is-dragover')));
    ['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, () => dropzone.classList.remove('is-dragover')));
    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files ? dt.files : [];
      if (files && files.length) setFilesAndRender(files);
    });
    dropzone.addEventListener('click', openPicker);
    dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { preventDefaults(e); openPicker(); } });
  }
  if (fileInput) {
    fileInput.addEventListener('change', () => { if (fileInput.files && fileInput.files.length) setFilesAndRender(fileInput.files); });
  }
  // Restore file list on load so refresh doesn't clear UI
  if (fileList) { renderFilesList(getStoredFiles()); }
  // Handle per-file remove button via event delegation
  if (fileList) {
    fileList.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.classList && target.classList.contains('remove-file')) {
        const name = target.getAttribute('data-name');
        const list = getStoredFiles().filter(f => f.name !== name);
        setStoredFiles(list);
        renderFilesList(list);
      }
    });
  }
})();


