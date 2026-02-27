/**
 * Shared contact form handler with anti-spam protection.
 * Used by all pages with id="contact-form".
 *
 * Anti-spam layers:
 * 1. Honeypot field (hidden input only bots fill)
 * 2. Time-based check (reject submissions under 3 seconds)
 * 3. Cloudflare Turnstile (invisible CAPTCHA)
 * 4. JS-level required field validation (blocks empty payloads)
 * 5. Turnstile token forwarded to webhook for server-side verification
 * 6. Computed form signature (proof the submission came from our JS)
 */

const WEBHOOK_URL = 'https://hook.eu1.make.com/9xbkv6yw2kf6xxgrwjebe6oyboxslt55';

// Set your Turnstile site key here after creating it in Cloudflare Dashboard.
// Leave empty to disable Turnstile (honeypot + time check still active).
const TURNSTILE_SITEKEY = '0x4AAAAAACin13uSYeS5ZQ6F';

// Required form fields — submissions missing any of these are rejected
const REQUIRED_FIELDS = ['nombre', 'email', 'telefono', 'pais', 'documento', 'privacidad'];

const form = document.getElementById('contact-form') as HTMLFormElement | null;

if (form) {
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const loadTime = Date.now();

  // --- Honeypot injection (invisible to humans) ---
  const hpWrapper = document.createElement('div');
  hpWrapper.setAttribute('aria-hidden', 'true');
  hpWrapper.style.cssText = 'position:absolute;left:-9999px;top:-9999px;overflow:hidden;height:0;width:0;';
  hpWrapper.innerHTML =
    '<label for="website_url">No rellenar este campo</label>' +
    '<input type="text" id="website_url" name="website_url" tabindex="-1" autocomplete="off">';
  form.prepend(hpWrapper);

  // --- Turnstile widget (explicit render to avoid race condition) ---
  if (TURNSTILE_SITEKEY && submitBtn) {
    const turnstileDiv = document.createElement('div');
    turnstileDiv.id = 'turnstile-widget';
    submitBtn.parentElement?.insertBefore(turnstileDiv, submitBtn);

    const renderWidget = () => {
      if ((window as any).turnstile) {
        (window as any).turnstile.render('#turnstile-widget', {
          sitekey: TURNSTILE_SITEKEY,
          theme: 'light',
        });
      } else {
        setTimeout(renderWidget, 200);
      }
    };
    renderWidget();
  }

  // --- Form submission handler ---
  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (!submitBtn) return;

    // Anti-spam check 1: honeypot
    const honeypot = form.querySelector<HTMLInputElement>('[name="website_url"]');
    if (honeypot?.value) {
      // Silently fake success so bots think it worked
      window.location.href = '/gracias/';
      return;
    }

    // Anti-spam check 2: time (< 3 s = likely bot)
    if (Date.now() - loadTime < 3000) {
      window.location.href = '/gracias/';
      return;
    }

    // Anti-spam check 3: Turnstile token
    let turnstileToken = '';
    if (TURNSTILE_SITEKEY) {
      const tokenInput = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
      if (!tokenInput?.value) {
        alert('Por favor, completa la verificación de seguridad.');
        return;
      }
      turnstileToken = tokenInput.value;
    }

    // Anti-spam check 4: required fields must be non-empty
    const formData = new FormData(form);
    for (const field of REQUIRED_FIELDS) {
      const val = (formData.get(field) as string || '').trim();
      if (!val) {
        alert('Por favor, rellena todos los campos obligatorios.');
        return;
      }
    }

    // Basic email format check
    const emailVal = (formData.get('email') as string || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      alert('Por favor, introduce un email válido.');
      return;
    }

    // --- Submit ---
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const data: Record<string, string> = {};

      for (const [key, value] of formData.entries()) {
        // Strip only the honeypot field from payload
        if (key === 'website_url') continue;
        // Strip Turnstile hidden input (we send the token separately below)
        if (key === 'cf-turnstile-response') continue;
        data[key] = value as string;
      }

      // Metadata
      data.source = 'tramitia.es';
      data.timestamp = new Date().toISOString();
      data.page = window.location.pathname;

      // Forward Turnstile token so Make.com can verify server-side
      if (turnstileToken) {
        data.turnstile_token = turnstileToken;
      }

      // Form signature: proof that this submission came from our JS, not a raw POST
      // Bots doing direct POST to the webhook won't know to include this
      const sig = btoa(`tramitia:${data.email}:${data.timestamp}`);
      data._sig = sig;

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.href = '/gracias/';
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(
        'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo o contáctanos por correo electrónico.',
      );
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
