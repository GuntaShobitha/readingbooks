/* ============================================
   INKWELL & SPINE — Authentication
   Client-side auth with validation and
   localStorage persistence
   ============================================ */

(function () {
  'use strict';

  /* ----- Utility ----- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.add('has-error');
    field.classList.remove('success');
    var errorEl = field.querySelector('.error-text');
    if (errorEl) {
      errorEl.textContent = message;
    } else {
      // Create error element if it doesn't exist
      var span = document.createElement('span');
      span.className = 'error-text';
      span.textContent = message;
      field.appendChild(span);
    }
  }

  function clearFieldError(input) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    var errorEl = field.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
  }

  function showFieldSuccess(input) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    field.classList.add('success');
  }

  function showFormMessage(form, type, message) {
    var msgEl = form.querySelector('.auth-message');
    if (!msgEl) {
      var div = document.createElement('div');
      div.className = 'auth-message ' + type;
      div.textContent = message;
      form.insertBefore(div, form.firstChild);
    } else {
      msgEl.className = 'auth-message ' + type + ' show';
      msgEl.textContent = message;
    }
    // Show the message
    var el = form.querySelector('.auth-message');
    if (el) {
      el.classList.add('show');
      setTimeout(function () {
        el.classList.remove('show');
      }, 4000);
    }
  }

  /* ----- Login Form ----- */
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      var role = loginForm.role;
      var email = loginForm.email;
      var password = loginForm.password;

      // Clear previous errors
      [role, email, password].forEach(clearFieldError);

      // Validate role
      if (!role.value) {
        showFieldError(role, 'Please select your role.');
        valid = false;
      } else {
        showFieldSuccess(role);
      }

      // Validate email
      if (!email.value.trim()) {
        showFieldError(email, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        showFieldSuccess(email);
      }

      // Validate password
      if (!password.value) {
        showFieldError(password, 'Password is required.');
        valid = false;
      } else if (password.value.length < 6) {
        showFieldError(password, 'Password must be at least 6 characters.');
        valid = false;
      } else {
        showFieldSuccess(password);
      }

      if (!valid) {
        showFormMessage(loginForm, 'error', 'Please fix the errors above and try again.');
        return;
      }

      // Store credentials
      localStorage.setItem('inkwell_role', role.value);
      localStorage.setItem('inkwell_email', email.value.trim());
      localStorage.setItem('inkwell_name', email.value.trim().split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }));

      // Redirect
      var target = role.value === 'admin' ? './admin.html' : './user.html';
      window.location.href = target;
    });

    // Real-time validation clearing
    loginForm.querySelectorAll('input, select').forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.value.trim()) {
          clearFieldError(input);
        }
      });
      input.addEventListener('change', function () {
        if (input.value) {
          clearFieldError(input);
          showFieldSuccess(input);
        }
      });
    });
  }

  /* ----- Register Form ----- */
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      var role = registerForm.role;
      var name = registerForm.name;
      var email = registerForm.email;
      var password = registerForm.password;

      // Clear previous errors
      [role, name, email, password].forEach(clearFieldError);

      // Validate role
      if (!role.value) {
        showFieldError(role, 'Please select your role.');
        valid = false;
      } else {
        showFieldSuccess(role);
      }

      // Validate name
      if (!name.value.trim()) {
        showFieldError(name, 'Full name is required.');
        valid = false;
      } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters.');
        valid = false;
      } else {
        showFieldSuccess(name);
      }

      // Validate email
      if (!email.value.trim()) {
        showFieldError(email, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        showFieldSuccess(email);
      }

      // Validate password
      if (!password.value) {
        showFieldError(password, 'Password is required.');
        valid = false;
      } else if (password.value.length < 8) {
        showFieldError(password, 'Password must be at least 8 characters.');
        valid = false;
      } else {
        showFieldSuccess(password);
      }

      if (!valid) {
        showFormMessage(registerForm, 'error', 'Please fix the errors above and try again.');
        return;
      }

      // Store credentials
      localStorage.setItem('inkwell_role', role.value || 'user');
      localStorage.setItem('inkwell_email', email.value.trim());
      localStorage.setItem('inkwell_name', name.value.trim());

      showFormMessage(registerForm, 'success', 'Account created successfully! Redirecting...');

      // Redirect after short delay
      setTimeout(function () {
        var target = role.value === 'admin' ? './admin.html' : './user.html';
        window.location.href = target;
      }, 1200);
    });

    // Real-time validation clearing
    registerForm.querySelectorAll('input, select').forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.value.trim()) {
          clearFieldError(input);
        }
      });
      input.addEventListener('change', function () {
        if (input.value) {
          clearFieldError(input);
          showFieldSuccess(input);
        }
      });
    });
  }

})();
