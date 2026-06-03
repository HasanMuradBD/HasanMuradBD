/* ─────────────────────────────────────────────
   Setupline Invoice Generator — script.js
   ───────────────────────────────────────────── */

const SERVICES = [
  { label: 'USA LLC Formation',       price: 299  },
  { label: 'UK Ltd Registration',     price: 249  },
  { label: 'EIN Acquisition',         price: 149  },
  { label: 'WordPress Development',   price: 799  },
  { label: 'Social Media Management', price: 499  },
];

const CURRENCY_SYMBOLS = { USD: '$', GBP: '£', EUR: '€', BDT: '৳' };

let itemCount = 0;

/* ── Helpers ── */
function fmt(value) {
  const sym = CURRENCY_SYMBOLS[document.getElementById('currency').value] || '$';
  return sym + parseFloat(value || 0).toFixed(2);
}

function generateInvoiceNumber() {
  const d = new Date();
  return `SL-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*900)+100)}`;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function dueDateStr(days = 14) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/* ── Recalculate Totals ── */
function recalc() {
  let sub = 0;
  document.querySelectorAll('.item-row').forEach(row => {
    const qty   = parseFloat(row.querySelector('.item-qty').value)   || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;
    row.querySelector('.item-total').textContent = fmt(total);
    sub += total;
  });

  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const tax     = sub * (taxRate / 100);
  const grand   = sub + tax;

  document.getElementById('subtotal').textContent  = fmt(sub);
  document.getElementById('taxAmount').textContent  = fmt(tax);
  document.getElementById('grandTotal').textContent = fmt(grand);
}

/* ── Add Line Item ── */
function addItem(desc = '', qty = 1, price = 0) {
  itemCount++;
  const id  = `item_${itemCount}`;
  const row = document.createElement('div');
  row.className = 'item-row grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-2 fade-in';
  row.dataset.id = id;

  row.innerHTML = `
    <div class="col-span-12 sm:col-span-5 relative">
      <input type="text" class="item-desc w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
        placeholder="Service / description" value="${desc}" autocomplete="off" />
      <div class="service-dropdown hidden absolute top-full mt-1 left-0 w-full">
        ${SERVICES.map(s => `
          <div class="service-option px-3 py-2 text-sm cursor-pointer transition"
            data-label="${s.label}" data-price="${s.price}">${s.label}
            <span class="text-xs text-gray-400 ml-1">— ${fmt(s.price)}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="col-span-4 sm:col-span-2">
      <input type="number" class="item-qty w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
        placeholder="1" min="1" value="${qty}" />
    </div>
    <div class="col-span-4 sm:col-span-2">
      <input type="number" class="item-price w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
        placeholder="0.00" min="0" step="0.01" value="${price}" />
    </div>
    <div class="col-span-3 sm:col-span-2 text-right pr-1">
      <span class="item-total text-sm font-semibold text-gray-700">${fmt(qty * price)}</span>
    </div>
    <div class="col-span-1 flex justify-end">
      <button type="button" class="remove-btn text-gray-300 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>`;

  const descInput   = row.querySelector('.item-desc');
  const dropdown    = row.querySelector('.service-dropdown');
  const qtyInput    = row.querySelector('.item-qty');
  const priceInput  = row.querySelector('.item-price');
  const removeBtn   = row.querySelector('.remove-btn');

  /* Show dropdown on focus/input */
  descInput.addEventListener('focus', () => dropdown.classList.remove('hidden'));
  descInput.addEventListener('input', () => {
    const q = descInput.value.toLowerCase();
    const opts = dropdown.querySelectorAll('.service-option');
    let any = false;
    opts.forEach(o => {
      const match = o.dataset.label.toLowerCase().includes(q);
      o.style.display = match ? '' : 'none';
      if (match) any = true;
    });
    dropdown.classList.toggle('hidden', !any && q.length > 0);
  });

  /* Select a service */
  dropdown.addEventListener('mousedown', e => {
    const opt = e.target.closest('.service-option');
    if (!opt) return;
    e.preventDefault();
    descInput.value  = opt.dataset.label;
    priceInput.value = opt.dataset.price;
    dropdown.classList.add('hidden');
    recalc();
  });

  document.addEventListener('click', e => {
    if (!row.contains(e.target)) dropdown.classList.add('hidden');
  }, { capture: true });

  qtyInput.addEventListener('input', recalc);
  priceInput.addEventListener('input', recalc);
  removeBtn.addEventListener('click', () => { row.remove(); recalc(); });

  document.getElementById('lineItems').appendChild(row);
  recalc();
}

/* ── Collect Form Data ── */
function collectData() {
  const items = [];
  document.querySelectorAll('.item-row').forEach(row => {
    const desc  = row.querySelector('.item-desc').value.trim();
    const qty   = parseFloat(row.querySelector('.item-qty').value)   || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    if (desc || qty || price) items.push({ desc, qty, price, total: qty * price });
  });

  const taxRate  = parseFloat(document.getElementById('taxRate').value) || 0;
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxAmt   = subtotal * (taxRate / 100);
  const grand    = subtotal + taxAmt;
  const currency = document.getElementById('currency').value;
  const sym      = CURRENCY_SYMBOLS[currency] || '$';

  return {
    fromName:      document.getElementById('fromName').value.trim(),
    fromEmail:     document.getElementById('fromEmail').value.trim(),
    fromPhone:     document.getElementById('fromPhone').value.trim(),
    fromAddress:   document.getElementById('fromAddress').value.trim(),
    clientName:    document.getElementById('clientName').value.trim(),
    clientEmail:   document.getElementById('clientEmail').value.trim(),
    clientPhone:   document.getElementById('clientPhone').value.trim(),
    clientAddress: document.getElementById('clientAddress').value.trim(),
    invoiceNumber: document.getElementById('invoiceNumber').value.trim(),
    invoiceDate:   document.getElementById('invoiceDate').value,
    dueDate:       document.getElementById('dueDate').value,
    paymentStatus: document.getElementById('paymentStatus').value,
    currency,
    currencySymbol: sym,
    notes:         document.getElementById('notes').value.trim(),
    items,
    subtotal,
    taxRate,
    taxAmount: taxAmt,
    grandTotal: grand,
  };
}

/* ── Validate ── */
function validate(data) {
  if (!data.clientName)    { alert('Please enter the client name.');      return false; }
  if (!data.invoiceNumber) { alert('Please enter an invoice number.');    return false; }
  if (data.items.length === 0) { alert('Please add at least one line item.'); return false; }
  return true;
}

/* ── Generate PDF ── */
document.getElementById('generatePdfBtn').addEventListener('click', async () => {
  const data = collectData();
  if (!validate(data)) return;

  showLoading('Generating PDF…');

  try {
    const resp = await fetch('generate_pdf.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);

    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Invoice-${data.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('PDF generation failed: ' + err.message);
  } finally {
    hideLoading();
  }
});

/* ── Email Modal ── */
document.getElementById('sendEmailBtn').addEventListener('click', () => {
  const data = collectData();
  if (!validate(data)) return;

  document.getElementById('modalEmail').value   = data.clientEmail;
  document.getElementById('modalSubject').value = `Invoice ${data.invoiceNumber} from Setupline`;
  document.getElementById('modalMessage').value =
    `Dear ${data.clientName || 'Client'},\n\nPlease find attached Invoice ${data.invoiceNumber} for ${data.currencySymbol}${data.grandTotal.toFixed(2)}.\n\nDue Date: ${data.dueDate || 'N/A'}\n\nThank you for choosing Setupline.\n\nBest regards,\n${data.fromName}`;

  document.getElementById('emailStatus').className = 'hidden';
  document.getElementById('emailModal').classList.remove('hidden');
});

function closeModal() { document.getElementById('emailModal').classList.add('hidden'); }
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('closeModal2').addEventListener('click', closeModal);
document.getElementById('emailModal').addEventListener('click', e => {
  if (e.target === document.getElementById('emailModal')) closeModal();
});

/* ── Send Email ── */
document.getElementById('confirmSendBtn').addEventListener('click', async () => {
  const toEmail = document.getElementById('modalEmail').value.trim();
  const subject = document.getElementById('modalSubject').value.trim();
  const message = document.getElementById('modalMessage').value.trim();
  const statusEl = document.getElementById('emailStatus');

  if (!toEmail) { showEmailStatus('error', 'Please enter a recipient email address.'); return; }

  const data = collectData();
  data.toEmail = toEmail;
  data.subject = subject;
  data.message = message;

  const btn = document.getElementById('confirmSendBtn');
  btn.disabled = true;
  btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Sending…`;

  try {
    const resp = await fetch('send_email.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await resp.json();
    if (json.success) {
      showEmailStatus('success', `Invoice sent successfully to ${toEmail}!`);
      setTimeout(closeModal, 2500);
    } else {
      showEmailStatus('error', json.message || 'Failed to send email.');
    }
  } catch (err) {
    showEmailStatus('error', 'Network error: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Send Invoice`;
  }
});

function showEmailStatus(type, msg) {
  const el = document.getElementById('emailStatus');
  el.className = `rounded-lg px-3 py-2 text-sm ${type === 'success'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200'}`;
  el.textContent = msg;
  el.classList.remove('hidden');
}

/* ── Loading helpers ── */
function showLoading(msg = 'Please wait…') {
  document.getElementById('loadingText').textContent = msg;
  document.getElementById('loadingOverlay').classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

/* ── Currency change ── */
document.getElementById('currency').addEventListener('change', recalc);
document.getElementById('taxRate').addEventListener('input', recalc);

/* ── Add Item button ── */
document.getElementById('addItemBtn').addEventListener('click', () => addItem());

/* ── Init ── */
(function init() {
  document.getElementById('invoiceNumber').value = generateInvoiceNumber();
  document.getElementById('invoiceDate').value   = todayStr();
  document.getElementById('dueDate').value        = dueDateStr(14);
  addItem('USA LLC Formation', 1, 299);
})();
