/* ============================================================
   Gospel Hub — JavaScript
   gospel-hub.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── NAV: shrink on scroll ───── */
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.height = '56px';
      nav.style.background = 'rgba(8,15,30,0.98)';
    } else {
      nav.style.height = '68px';
      nav.style.background = 'rgba(8,15,30,0.95)';
    }
  });

  /* ───── MOBILE NAV TOGGLE ───── */
  // Inject a hamburger button for mobile (hidden via CSS on desktop)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  nav.appendChild(hamburger);

  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.classList.toggle('is-active', isOpen);
  });

  // Close nav when a link is clicked on mobile
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-open');
      hamburger.classList.remove('is-active');
    });
  });

  // Inject mobile nav styles dynamically
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    .nav-hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
    }
    .nav-hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: rgba(255,255,255,0.7);
      border-radius: 2px;
      transition: transform 0.25s, opacity 0.25s;
    }
    .nav-hamburger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.is-active span:nth-child(2) { opacity: 0; }
    .nav-hamburger.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 900px) {
      .nav-hamburger { display: flex; }
      .nav-links.nav-open {
        display: flex !important;
        flex-direction: column;
        position: fixed;
        top: 68px; left: 0; right: 0;
        background: rgba(8,15,30,0.98);
        padding: 24px 20px;
        gap: 20px;
        border-bottom: 1px solid rgba(192,57,43,0.2);
        z-index: 99;
      }
    }
  `;
  document.head.appendChild(mobileStyle);

  /* ───── SCROLL-IN ANIMATIONS (Intersection Observer) ───── */
  const animatedEls = document.querySelectorAll(
    '.feature-card, .plan-card, .story-card, .topic-chip, .votd-text'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
    observer.observe(el);
  });

  /* ───── VOTD: COPY / SHARE ───── */
  const shareBtns = document.querySelectorAll('.votd-btn');
  const votdText  = document.querySelector('.votd-text');
  const votdRef   = document.querySelector('.votd-ref');

  shareBtns.forEach(btn => {
    if (btn.textContent.trim() === 'Share') {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const text = `"${votdText?.textContent.trim()}" — ${votdRef?.textContent.trim()}`;

        if (navigator.share) {
          try {
            await navigator.share({ text });
          } catch (_) { /* user cancelled */ }
        } else {
          // Fallback: copy to clipboard
          try {
            await navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 2000);
          } catch (_) {
            alert('Could not copy verse. Please copy manually.');
          }
        }
      });
    }

    if (btn.textContent.trim() === 'Bookmark') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookmarked = btn.dataset.bookmarked === 'true';
        btn.dataset.bookmarked = !bookmarked;
        btn.textContent = bookmarked ? 'Bookmark' : '✓ Saved';
        btn.style.background = bookmarked
          ? 'rgba(192,57,43,0.1)'
          : 'rgba(192,57,43,0.3)';
      });
    }
  });

  /* ───── SMOOTH SCROLL for anchor links ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});