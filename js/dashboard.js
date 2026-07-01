/* ============================================
   INKWELL & SPINE — Dashboard Functionality
   Section navigation, mobile sidebar, profile
   dropdowns, logout, and data management
   ============================================ */

(function () {
  'use strict';

  /* ----- Utility ----- */
  function $(id) { return document.getElementById(id); }

  function showFieldError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.add('has-error');
    field.classList.remove('success');
    var errorEl = field.querySelector('.error-text');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(input) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    var errorEl = field.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
  }

  /* ----- Load user data from localStorage ----- */
  var role = localStorage.getItem('inkwell_role') || 'user';
  var email = localStorage.getItem('inkwell_email') || 'guest@inkwellspine.com';
  var displayName = localStorage.getItem('inkwell_name') ||
    email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || 'Guest';
  var avatar = role === 'admin' ? './images/author2.webp' : './images/author1.webp';

  /* ----- Update all profile elements ----- */
  var titleEl = $('dash-title');
  if (titleEl) {
    titleEl.textContent = role === 'admin' ? 'Admin Dashboard' : 'My Reading Library';
  }

  // Helper to set text content
  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text;
  }

  function setSrc(id, src) {
    var el = $(id);
    if (el) el.src = src;
  }

  // Sync profile across all locations
  var nameIds = ['dash-profile-name', 'dash-profile-menu-name', 'dash-side-profile-name',
    'profile-name-display', 'page-profile-name'];
  nameIds.forEach(function (id) { setText(id, displayName); });

  var emailIds = ['dash-profile-email', 'dash-profile-menu-email', 'dash-side-profile-email',
    'profile-email-display', 'page-profile-email'];
  emailIds.forEach(function (id) { setText(id, email); });

  var roleIds = ['dash-profile-menu-role', 'dash-side-profile-role', 'profile-role-display', 'page-profile-role'];
  roleIds.forEach(function (id) { setText(id, role); });

  var avatarIds = ['dash-profile-avatar', 'dash-side-profile-avatar', 'profile-avatar-lg', 'page-profile-avatar'];
  avatarIds.forEach(function (id) { setSrc(id, avatar); });

  // Pre-fill profile forms if they exist
  var nameInput = $('profile-name-input') || $('edit-name');
  if (nameInput) nameInput.value = displayName;

  var emailInput = $('profile-email-input') || $('edit-email');
  if (emailInput) emailInput.value = email;

  /* ----- Sidebar Section Navigation (for admin.html and user.html) ----- */
  var navLinks = document.querySelectorAll('.dash-nav a');
  var sections = document.querySelectorAll('.dash-section');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Update active link
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');

      // Show corresponding section
      var sectionId = link.getAttribute('data-section');
      if (sectionId) {
        sections.forEach(function (section) {
          section.style.display = section.id === 'section-' + sectionId ? '' : 'none';
        });

        // Update title
        var sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
        if (titleEl) {
          var prefix = role === 'admin' ? 'Admin' : 'My';
          titleEl.textContent = prefix + ' — ' + sectionName;
        }

        // Update URL hash
        history.pushState(null, '', '#' + sectionId);
      }

      // Close sidebar on mobile
      if (window.innerWidth <= 1024) {
        closeSide();
      }
    });
  });

  /* ----- Check URL hash on load ----- */
  var hash = window.location.hash.replace('#', '');
  if (hash) {
    var targetLink = document.querySelector('.dash-nav a[data-section="' + hash + '"]');
    if (targetLink) {
      targetLink.click();
    }
  }

  /* ----- Logout ----- */
  function doLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('inkwell_role');
    localStorage.removeItem('inkwell_email');
    localStorage.removeItem('inkwell_name');
    window.location.href = './index.html';
  }

  var logoutIds = ['logout', 'logout-menu', 'logout-side', 'logout-top'];
  logoutIds.forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('click', doLogout);
  });

  /* ----- Mobile Sidebar ----- */
  var side = $('dash-side');
  var backdrop = $('dash-backdrop');
  var openBtn = $('mobile-toggle');
  var closeBtn = $('dash-side-close');

  function openSide() {
    if (side) side.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    // Focus management
    if (closeBtn) closeBtn.focus();
  }

  function closeSide() {
    if (side) side.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    // Return focus to open button
    if (openBtn) openBtn.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openSide);
  if (closeBtn) closeBtn.addEventListener('click', closeSide);
  if (backdrop) backdrop.addEventListener('click', closeSide);

  // Close sidebar on nav link click on mobile
  document.querySelectorAll('.dash-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 1024) closeSide();
    });
  });

  // Close sidebar on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && side && side.classList.contains('open')) {
      closeSide();
    }
  });

  /* ----- Profile Dropdowns ----- */
  function wireDropdown(wrapId, triggerId) {
    var wrap = $(wrapId);
    var trigger = $(triggerId);
    if (!wrap || !trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        wrap.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  }

  // wireDropdown('dash-profile', 'dash-profile-trigger');
  // wireDropdown('dash-side-profile', 'dash-side-profile-trigger');

  /* ----- Profile Form Submission ----- */
  var profileForm = $('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var pNameInput = $('profile-name-input');
      var pEmailInput = $('profile-email-input');

      if (pNameInput) {
        if (!pNameInput.value.trim()) {
          showFieldError(pNameInput, 'Name is required.');
          valid = false;
        } else {
          clearFieldError(pNameInput);
        }
      }

      if (pEmailInput) {
        if (!pEmailInput.value.trim()) {
          showFieldError(pEmailInput, 'Email is required.');
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pEmailInput.value)) {
          showFieldError(pEmailInput, 'Invalid email.');
          valid = false;
        } else {
          clearFieldError(pEmailInput);
        }
      }

      if (valid) {
        // Update stored data
        if (pNameInput) {
          localStorage.setItem('inkwell_name', pNameInput.value.trim());
          displayName = pNameInput.value.trim();
          nameIds.forEach(function (id) { setText(id, displayName); });
        }
        if (pEmailInput) {
          localStorage.setItem('inkwell_email', pEmailInput.value.trim());
          email = pEmailInput.value.trim();
          emailIds.forEach(function (id) { setText(id, email); });
        }

        alert('Profile updated successfully!');
      }
    });

    // Real-time validation clearing on inputs
    profileForm.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.value.trim()) clearFieldError(input);
      });
    });
  }

  /* ----- Settings Form ----- */
  var settingsForm = $('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Settings saved successfully!');
    });
  }

})();
