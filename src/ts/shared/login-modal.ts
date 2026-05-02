// src/ts/shared/login-modal.ts

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length === 0) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

function setupEmailValidation(
  emailInput: HTMLInputElement,
  emailError: HTMLElement | null,
): void {
  emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();
    if (value.length === 0) {
      emailInput.classList.remove('input--error', 'input--success');
      emailError?.classList.remove('modal__error--visible');
      return;
    }
    if (validateEmail(value)) {
      emailInput.classList.add('input--success');
      emailInput.classList.remove('input--error');
      emailError?.classList.remove('modal__error--visible');
    } else {
      emailInput.classList.add('input--error');
      emailInput.classList.remove('input--success');
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('modal__error--visible');
      }
    }
  });
}

export function initLoginModal(): void {
  const userIcon = document.querySelector('.header__action-link[href="#"]');
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('login-form') as HTMLFormElement;
  const emailInput = document.getElementById('login-email') as HTMLInputElement;
  const passwordInput = document.getElementById(
    'login-password',
  ) as HTMLInputElement;
  const rememberMe = document.getElementById('remember-me') as HTMLInputElement;
  const togglePasswordBtn = document.getElementById('toggle-password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const successMessage = document.getElementById('login-success');
  const forgotPassword = document.querySelector('.modal__forgot');

  if (!userIcon || !modal || !form) return;

  function openModal(): void {
    modal?.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
    form?.reset();
    emailInput?.classList.remove('input--error', 'input--success');
    passwordInput?.classList.remove('input--error', 'input--success');
    emailError?.classList.remove('modal__error--visible');
    passwordError?.classList.remove('modal__error--visible');
    successMessage?.classList.remove('modal__success--visible');
    if (passwordInput) passwordInput.type = 'password';
    const savedEmail = localStorage.getItem('remembered-email');
    if (savedEmail && emailInput) {
      emailInput.value = savedEmail;
      if (rememberMe) rememberMe.checked = true;
    }
  }

  function closeModal(): void {
    modal?.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener('click', closeModal);

  forgotPassword?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your email.');
  });

  togglePasswordBtn?.addEventListener('click', () => {
    if (passwordInput) {
      passwordInput.type =
        passwordInput.type === 'password' ? 'text' : 'password';
    }
  });

  setupEmailValidation(emailInput, emailError);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const email = emailInput?.value.trim() || '';
    if (!validateEmail(email)) {
      isValid = false;
      emailInput?.classList.add('input--error');
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('modal__error--visible');
      }
    }

    const passwordErrorText = validatePassword(passwordInput?.value || '');
    if (passwordErrorText) {
      isValid = false;
      passwordInput?.classList.add('input--error');
      if (passwordError) {
        passwordError.textContent = passwordErrorText;
        passwordError.classList.add('modal__error--visible');
      }
    }

    if (isValid) {
      if (rememberMe?.checked && emailInput?.value) {
        localStorage.setItem('remembered-email', emailInput.value);
      } else {
        localStorage.removeItem('remembered-email');
      }
      if (successMessage) {
        successMessage.textContent = 'Login successful! Welcome back!';
        successMessage.classList.add('modal__success--visible');
      }
      setTimeout(closeModal, 1500);
    }
  });
}
