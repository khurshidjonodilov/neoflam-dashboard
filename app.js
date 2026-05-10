/* =====================================
   Neoflam UZ Dashboard — interactivity
   ===================================== */

// ---- Animated counters ----
function animateCounter(el, target, duration = 1400) {
  const start = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
  const isCurrency = /\$|\,/.test(target.toString());
  const endVal = parseInt(target.toString().replace(/[^\d]/g, ''));
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (endVal - start) * eased);
    el.textContent = isCurrency
      ? current.toLocaleString('en-US')
      : current.toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---- Run counters when in viewport ----
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.dataset.counter;
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-counter]').forEach(el => {
  counterObserver.observe(el);
});

// ---- Smooth scroll for nav ----
document.querySelectorAll('.topnav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ---- Active nav highlighting on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topnav a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.topnav a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

// ---- Chart.js — products demand vs sales ----
window.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('productsChart');
  if (!ctx || typeof Chart === 'undefined') return;

  // Custom font
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.color = '#4A5057';

  const data = {
    labels: ['Fika4', 'Bebe', 'Fika6', 'Vakuum nabor', 'Blinnitsa', 'Bein', 'Qozon', 'Sherbet'],
    datasets: [
      {
        label: 'Запросы',
        data: [151, 88, 23, 23, 15, 8, 8, 1],
        backgroundColor: 'rgba(44, 95, 93, 0.85)',
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 24,
      },
      {
        label: 'Продажи',
        data: [2, 0, 1, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(232, 168, 124, 0.95)',
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 24,
      }
    ]
  };

  new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1B1F23',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12, weight: '500' } },
        },
        y: {
          grid: { color: '#F0EAD9', drawBorder: false },
          ticks: { font: { size: 11 }, padding: 8 },
        }
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      }
    }
  });
});

// ---- Funnel animation on scroll ----
const funnelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      funnelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.funnel-step').forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = `all .6s ease ${i * 0.15}s`;
  funnelObserver.observe(step);
});
