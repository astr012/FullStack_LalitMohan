/* app.js: plain JS wiring for menu, lightbox gallery, modal, forms, small demo interactions
   NOTE: This is demo-only and stores no server data. Replace POST endpoints with your server or booking provider.
*/

document.addEventListener('DOMContentLoaded', function () {
  // NAV TOGGLE
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });

  // OPEN RESERVATION MODAL
  const openButtons = [document.getElementById('book-btn'), document.getElementById('hero-book'), document.getElementById('hero-book')];
  const modal = document.getElementById('reservation-modal');
  const modalClose = document.getElementById('modal-close');
  openButtons.forEach(btn => btn?.addEventListener('click', openModal));
  modalClose?.addEventListener('click', closeModal);
  function openModal(){ modal.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal(){ modal.hidden = true; document.body.style.overflow = ''; }

  // RESERVATION: demo submit
  const resForm = document.getElementById('reservation-form');
  resForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(resForm);
    // demo: show a confirmation dialog
    alert(`Reservation requested:\nName: ${data.get('name')}\nDate: ${data.get('date')} ${data.get('time')}\nParty: ${data.get('party')}\nWe would integrate this with your booking provider.`);
    closeModal();
    resForm.reset();
  });

  // OpenTable demo link
  document.getElementById('modal-opentable')?.addEventListener('click', function(){
    window.open('https://www.opentable.com', '_blank');
  });

  // MENU: sample items (mirrors features: dietary tags, price)
  const MENU = [
    { id:1, section:'alacarte', title:'Grilled Sea Bass', desc:'New season fish with lemon butter', price:'£19', tags:['gluten-free'] },
    { id:2, section:'alacarte', title:'Beetroot & Goat Cheese', desc:'Roasted beetroot, dill, toasted seeds', price:'£10', tags:['vegetarian'] },
    { id:3, section:'lunch', title:'Lunch Steak Sandwich', desc:'Sirloin, caramelised onion, aioli', price:'£12', tags:[] },
    { id:4, section:'desserts', title:'Chocolate Fondant', desc:'Molten centre, vanilla ice cream', price:'£8', tags:['vegetarian'] },
    { id:5, section:'drinks', title:'Bennie Martini', desc:'House martini with citrus twist', price:'£9', tags:[] },
    { id:6, section:'wine', title:'Chardonnay, 2019', desc:'Crisp & zesty', price:'£7 (glass)', tags:[] },
    { id:7, section:'private', title:'Party Set A', desc:'3-course group menu (per person)', price:'£35', tags:['vegetarian option available'] },
    { id:8, section:'alacarte', title:'Wild Mushroom Risotto', desc:'Arborio rice, white wine, parmesan', price:'£14', tags:['vegetarian','gluten-free'] },
  ];

  const menuList = document.getElementById('menu-list');
  const dietFilter = document.getElementById('diet-filter');
  const sectionFilter = document.getElementById('menu-section');

  function renderMenu() {
    const diet = dietFilter.value;
    const section = sectionFilter.value;
    menuList.innerHTML = '';
    const filtered = MENU.filter(item => {
      if (diet !== 'all') {
        if (diet === 'gluten-free') {
          if (!item.tags.includes('gluten-free')) return false;
        } else if (diet === 'vegetarian') {
          if (!item.tags.includes('vegetarian')) return false;
        } else if (diet === 'vegan') {
          if (!item.tags.includes('vegan')) return false;
        }
      }
      if (section !== 'all' && item.section !== section) return false;
      return true;
    });

    if (!filtered.length) {
      menuList.innerHTML = '<p class="muted-sm">No items match this filter.</p>';
      return;
    }

    filtered.forEach(it => {
      const el = document.createElement('div');
      el.className = 'menu-item';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <h4>${it.title}</h4>
            <p class="menu-meta">${it.desc}</p>
            <div style="margin-top:6px">${it.tags.map(t=>`<span class="tag">${t}</span>`).join(' ')}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:600">${it.price}</div>
            <button class="ghost" data-id="${it.id}" style="margin-top:8px">Add to order</button>
          </div>
        </div>
      `;
      menuList.appendChild(el);
    });
  }

  dietFilter?.addEventListener('change', renderMenu);
  sectionFilter?.addEventListener('change', renderMenu);
  renderMenu();

  // Simple "add to order" demo
  menuList.addEventListener('click', function(e){
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const item = MENU.find(m=>m.id===id);
    alert(`Added to order: ${item.title} — ${item.price}\n(This demo does not persist an order.)`);
  });

  // GALLERY: build placeholders
  const GALLERY = Array.from({length:8}).map((_,i) => ({
    src:`https://picsum.photos/1200/800?random=${i+1}`,
    thumb:`https://picsum.photos/600/400?random=${i+1}`,
    caption:`Photo ${i+1} — Sample caption`
  }));

  const galleryGrid = document.getElementById('gallery-grid');
  GALLERY.forEach((g, idx) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    div.innerHTML = `<img src="${g.thumb}" loading="lazy" alt="${g.caption}" data-index="${idx}"/>`;
    galleryGrid.appendChild(div);
  });

  // LIGHTBOX
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let lbIndex = 0;

  galleryGrid.addEventListener('click', (ev) => {
    const img = ev.target.closest('img');
    if (!img) return;
    lbIndex = Number(img.dataset.index);
    openLightbox(lbIndex);
  });

  function openLightbox(i){
    lbImg.src = GALLERY[i].src;
    lbCaption.textContent = GALLERY[i].caption;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){ lb.hidden = true; document.body.style.overflow = ''; }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { lbIndex = (lbIndex-1+GALLERY.length)%GALLERY.length; openLightbox(lbIndex); });
  lbNext.addEventListener('click', () => { lbIndex = (lbIndex+1)%GALLERY.length; openLightbox(lbIndex); });

  // KEYBOARD shortcuts for lightbox and modal
  document.addEventListener('keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    }
    if (!modal.hidden) {
      if (e.key === 'Escape') closeModal();
    }
  });

  // PRIVATE HIRE form demo (does not send)
  document.getElementById('private-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Private hire enquiry sent. We will contact you with options and pricing.');
    e.target.reset();
  });

  // CONTACT form demo (does not send)
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! We received your message and will reply shortly.');
    e.target.reset();
  });

  // small accessibility improvement: focus trap for modal (basic)
  modal?.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(modal.querySelectorAll('button, [href], input, textarea, select')).filter(a=>!a.disabled);
    if (focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length-1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });

});
