/**
 * Shared contact form handler with anti-spam protection.
 * Used by all pages with id="contact-form".
 *
 * Anti-spam layers:
 * 1. Honeypot field (hidden input only bots fill)
 * 2. Time-based check (reject submissions under 3 seconds)
 * 3. Cloudflare Turnstile (invisible CAPTCHA, optional)
 */

const WEBHOOK_URL = 'https://hook.eu1.make.com/9xbkv6yw2kf6xxgrwjebe6oyboxslt55';

// Set your Turnstile site key here after creating it in Cloudflare Dashboard.
// Leave empty to disable Turnstile (honeypot + time check still active).
const TURNSTILE_SITEKEY = '0x4AAAAAACin13uSYeS5ZQ6F';

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

  // --- Turnstile widget injection (if configured) ---
  if (TURNSTILE_SITEKEY && submitBtn) {
    const turnstileDiv = document.createElement('div');
    turnstileDiv.className = 'cf-turnstile';
    turnstileDiv.dataset.sitekey = TURNSTILE_SITEKEY;
    turnstileDiv.dataset.theme = 'light';
    submitBtn.parentElement?.insertBefore(turnstileDiv, submitBtn);
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
    if (TURNSTILE_SITEKEY) {
      const token = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
      if (!token?.value) {
        alert('Por favor, completa la verificación de seguridad.');
        return;
      }
    }

    // --- Submit ---
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      for (const [key, value] of formData.entries()) {
        // Strip anti-spam fields from payload
        if (key === 'website_url' || key === 'cf-turnstile-response') continue;
        data[key] = value as string;
      }

      // Metadata
      data.source = 'tramitia.es';
      data.timestamp = new Date().toISOString();
      data.page = window.location.pathname;

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
