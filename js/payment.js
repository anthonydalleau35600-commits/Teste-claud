/* ============================================
   PAYMENT.JS — Stripe simulation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Card number formatter ─────────────────
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  // ── Expiry formatter ──────────────────────
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      e.target.value = v;
    });
  }

  // ── CVC formatter ─────────────────────────
  const cvcInput = document.getElementById('card-cvc');
  if (cvcInput) {
    cvcInput.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
  }

  // ── Payment form submit ───────────────────
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validatePaymentForm()) return;
      await processPayment();
    });
  }

});

function validatePaymentForm() {
  const name = document.getElementById('card-name')?.value?.trim();
  const number = document.getElementById('card-number')?.value?.replace(/\s/g, '');
  const expiry = document.getElementById('card-expiry')?.value;
  const cvc = document.getElementById('card-cvc')?.value;

  if (!name) { showToast('Nom sur la carte requis.', 'error'); return false; }
  if (!number || number.length < 16) { showToast('Numéro de carte invalide.', 'error'); return false; }
  if (!expiry || !expiry.includes('/')) { showToast('Date d\'expiration invalide.', 'error'); return false; }
  if (!cvc || cvc.length < 3) { showToast('CVC invalide.', 'error'); return false; }

  const [month, year] = expiry.split('/');
  const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  if (expDate < new Date()) { showToast('Carte expirée.', 'error'); return false; }

  return true;
}

async function processPayment() {
  const btn = document.getElementById('pay-btn');
  if (!btn) return;

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner">⟳</span> Traitement…';

  await sleep(2200);

  // Simulate success (95% rate)
  const success = Math.random() > 0.05;

  if (success) {
    closeModal('payment-modal');
    await sleep(200);
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      showToast('🎉 Paiement réussi ! Accès envoyé par email.', 'success');
    }
  } else {
    showToast('❌ Paiement refusé. Vérifiez vos informations.', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = '🔒 Payer maintenant';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── CTA buttons trigger modal ─────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-buy]');
  if (btn) {
    const title = btn.dataset.buyTitle || 'Formation IA';
    const price = btn.dataset.buyPrice || '197€';
    const oldPrice = btn.dataset.buyOld || '';
    window.openPaymentModal?.(title, price, oldPrice);
  }
});
