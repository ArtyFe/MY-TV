// script.js
// Ajout d'animations dynamiques, de graphiques et de compteurs pour le portfolio d'Arty Feriole

// --- Animation compteur KPI ---
function animateCounter(element, end, duration = 2000) {
  let start = 0;
  const step = Math.ceil(end / (duration / 16));
  function update() {
    start += step;
    if (start >= end) {
      element.textContent = end;
    } else {
      element.textContent = start;
      requestAnimationFrame(update);
    }
  }
  update();
}

// --- Initialisation des compteurs dynamiques ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.kpi-counter').forEach(function(counter) {
    const end = parseInt(counter.dataset.kpi, 10);
    animateCounter(counter, end);
  });
});

// --- Graphique radar compétences (Chart.js) ---
window.addEventListener('DOMContentLoaded', function() {
  if (window.Chart) {
    const ctx = document.getElementById('skillsRadar');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Gestion de projet',
            'Bureautique',
            'Marketing digital',
            'Formation',
            'Créativité',
            'Communication'
          ],
          datasets: [{
            label: 'Compétences',
            data: [90, 90, 90, 90, 90, 90],
            backgroundColor: 'rgba(76,205,196,0.2)',
            borderColor: '#4ecdc4',
            pointBackgroundColor: '#ff6b6b',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { r: { angleLines: { color: '#fff2' }, grid: { color: '#fff2' }, pointLabels: { color: '#fff' }, min: 0, max: 100 } }
        }
      });
    }
  }
});

// --- Timeline animée (GSAP) ---
window.addEventListener('DOMContentLoaded', function() {
  if (window.gsap) {
    const items = gsap.utils.toArray('.timeline-item');
    items.forEach((item, i) => {
      gsap.fromTo(item, {
        opacity: 0,
        y: 60
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
        },
        onComplete: function() {
          // Si c'est le dernier item, on relance toute la timeline après un délai
          if (i === items.length - 1) {
            setTimeout(() => {
              items.forEach((it, j) => {
                gsap.to(it, { opacity: 0, y: 60, duration: 0.5, delay: j * 0.08 });
              });
              setTimeout(() => {
                items.forEach((it, j) => {
                  gsap.to(it, { opacity: 1, y: 0, duration: 0.8, delay: j * 0.2 });
                });
              }, items.length * 80 + 600); // relance après disparition
            }, 4000); // délai d'attente après la dernière apparition (4s)
          }
        }
      });
    });
  }
});

// --- Formulaire de contact dynamique ---
document.addEventListener('DOMContentLoaded', function() {
  const interest = document.getElementById('interest');
  const detailsGroup = document.getElementById('detailsGroup');
  if (interest && detailsGroup) {
    interest.addEventListener('change', function() {
      if (interest.value === 'autre' || interest.value === 'accompagnement') {
        detailsGroup.style.display = '';
      } else {
        detailsGroup.style.display = 'none';
      }
    });
  }

  // Soumission AJAX (Formspree)
  const form = document.getElementById('dynamicContactForm');
  const formMessage = document.getElementById('formMessage');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      formMessage.textContent = 'Envoi en cours...';
      formMessage.style.color = '#4ecdc4';
      const data = {
        name: form.name.value,
        email: form.email.value,
        interest: form.interest.value,
        details: form.details ? form.details.value : ''
      };
      fetch('https://formspree.io/f/xwkgyyqg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => {
        if (res.ok) {
          formMessage.textContent = 'Merci, votre demande a bien été envoyée !';
          formMessage.style.color = '#4ecdc4';
          form.reset();
          detailsGroup.style.display = 'none';
        } else {
          formMessage.textContent = 'Erreur lors de l\'envoi. Merci de réessayer.';
          formMessage.style.color = '#ff6b6b';
        }
      })
      .catch(() => {
        formMessage.textContent = 'Erreur réseau. Merci de réessayer.';
        formMessage.style.color = '#ff6b6b';
      });
    });
  }
});

// --- Chatbot vocal multilingue avec bouton ON/OFF ---
(function() {
  let synth = window.speechSynthesis;
  let isPowerOn = true; // Contrôle ON/OFF global

  function speakText(text, lang) {
    if (!isPowerOn || !synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || navigator.language || 'fr-FR';
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    // Sélection de la voix correspondant à la langue
    const voices = synth.getVoices();
    if (voices.length > 0) {
      const match = voices.find(v => v.lang.toLowerCase().startsWith(utter.lang.toLowerCase()));
      if (match) utter.voice = match;
    }
    synth.cancel();
    synth.speak(utter);
  }

  const LANGS = [
    { code: 'fr-FR', label: 'Français' },
    { code: 'en-US', label: 'English' },
    { code: 'es-ES', label: 'Español' },
    { code: 'de-DE', label: 'Deutsch' },
    { code: 'it-IT', label: 'Italiano' },
    { code: 'pt-PT', label: 'Português' },
    { code: 'ru-RU', label: 'Русский' },
    { code: 'zh-CN', label: '中文' },
    { code: 'ja-JP', label: '日本語' }
  ];

  document.addEventListener('DOMContentLoaded', function() {
    const float = document.getElementById('chatbot-float');
    const toggle = document.getElementById('chatbot-toggle');
    const windowBox = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const readSel = document.getElementById('chatbot-read-selection');

    // Ajout du sélecteur de langue
    let langSelect = document.createElement('select');
    langSelect.id = 'chatbot-lang';
    langSelect.style = 'width:100%;margin-bottom:0.5rem;padding:0.3rem 0.5rem;border-radius:999px;border:1.5px solid #4ecdc4;font-size:1.08rem;background:linear-gradient(90deg,#fffbe6 60%,#4ecdc4 100%);color:#23272f;font-weight:700;appearance:none;text-align:center;';
    let defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.hidden = false;
    defaultOpt.textContent = 'Langue';
    langSelect.appendChild(defaultOpt);
    LANGS.forEach(l => {
      let opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.label;
      langSelect.appendChild(opt);
    });
    windowBox.insertBefore(langSelect, windowBox.children[2]);
    langSelect.value = '';

    // Ajout du bouton ON/OFF
    let powerBtn = document.createElement('button');
    powerBtn.id = 'chatbot-power';
    powerBtn.textContent = '🔊 ON';
    powerBtn.style = 'margin-bottom:0.5rem;background:#23272f;color:#4ecdc4;border:none;border-radius:8px;padding:0.4rem 0.8rem;font-size:1rem;cursor:pointer;width:100%';
    windowBox.insertBefore(powerBtn, langSelect);
    powerBtn.onclick = function() {
      isPowerOn = !isPowerOn;
      powerBtn.textContent = isPowerOn ? '🔊 ON' : '🔇 OFF';
      powerBtn.style.background = isPowerOn ? '#23272f' : '#4ecdc4';
      powerBtn.style.color = isPowerOn ? '#4ecdc4' : '#fff';
      if (!isPowerOn) window.speechSynthesis.cancel();
    };

    if (toggle && windowBox) {
      toggle.onclick = () => windowBox.style.display = 'block';
    }
    if (close && windowBox) {
      close.onclick = () => windowBox.style.display = 'none';
    }
    if (form && input && messages) {
      form.onsubmit = function(e) {
        e.preventDefault();
        const txt = input.value.trim();
        if (!txt) return;
        const lang = langSelect.value;
        messages.innerHTML += `<div style='margin-bottom:0.4rem;'><b>Vous :</b> ${txt}</div>`;
        if (isPowerOn) speakText(txt, lang);
        input.value = '';
      };
    }
    if (readSel) {
      readSel.onclick = function() {
        let txt = '';
        if (window.getSelection) {
          txt = window.getSelection().toString();
        }
        if (!txt) txt = prompt('Sélectionnez ou collez le texte à lire :');
        if (txt) {
          const lang = langSelect.value;
          messages.innerHTML += `<div style='margin-bottom:0.4rem;'><b>Lecture :</b> ${txt}</div>`;
          if (isPowerOn) speakText(txt, lang);
        }
      };
    }

    // Lecture automatique du portfolio dans la langue choisie
    if (windowBox) {
      let autoReadBtn = document.createElement('button');
      autoReadBtn.textContent = 'Lire tout le portfolio';
      autoReadBtn.style = 'margin-top:0.5rem;background:#4ecdc4;color:#fff;border:none;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.98rem;cursor:pointer;width:100%';
      windowBox.appendChild(autoReadBtn);
      autoReadBtn.onclick = function() {
        if (!isPowerOn) return;
        let allText = '';
        // Récupère le texte principal du portfolio (hero, about, projets, contact)
        // On ne lit que les textes visibles et non décoratifs
        const mainSections = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .about-text, .project-title, .project-description, .section-title, .timeline-content, .contact-content');
        mainSections.forEach(el => {
          // On ne lit que si l'élément est visible et non aria-hidden
          const style = window.getComputedStyle(el);
          if (el.offsetParent !== null && style.visibility !== 'hidden' && style.display !== 'none' && !el.hasAttribute('aria-hidden')) {
            if (el.innerText) allText += el.innerText + '\n';
          }
        });
        if (allText) {
          const lang = langSelect.value;
          messages.innerHTML += `<div style='margin-bottom:0.4rem;'><b>Lecture du portfolio :</b> <span style="font-size:0.95em;">(${lang})</span></div>`;
          speakText(allText, lang);
        }
      };
    }
  });
})();

// Effet doré animé façon clavier ordinateur sur le texte "À propos de moi" avec son de frappe et vitesse ajustable

document.addEventListener('DOMContentLoaded', function () {
  const typewriterText = "Cheffe de projet passionnée par l’innovation, la gestion d’équipe et la transformation digitale.";
  const typewriterElem = document.getElementById('about-gold-typewriter');
  if (!typewriterElem) return;

  // Paramètres de vitesse (1s = rapide, 2s = lent)
  const totalDuration = 1500; // ms (1.5s, ajustez à 1000 pour 1s ou 2000 pour 2s)
  const step = Math.max(18, Math.floor(totalDuration / typewriterText.length));

  // Préparation du son de frappe
  let audioCtx;
  function playTypeSound() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 340 + Math.random() * 40;
    g.gain.value = 0.08 + Math.random() * 0.04;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.04);
  }

  let i = 0;
  function typeWriter() {
    if (i <= typewriterText.length) {
      typewriterElem.textContent = typewriterText.slice(0, i);
      if (i > 0 && typewriterText[i-1] !== ' ') playTypeSound();
      i++;
      setTimeout(typeWriter, step);
    } else {
      typewriterElem.classList.add('done');
      typewriterElem.style.borderRight = 'none';
    }
  }
  typeWriter();
});

// Effet typewriter expert premium pour le texte à propos
function typeWriterExpert(selector, text, totalDuration = 4000, repeat = true, pause = 800) {
  const el = document.querySelector(selector);
  if (!el) return;
  let running = false;
  function startTypewriter() {
    el.textContent = '';
    const words = text.split(' ');
    const wordCount = words.length;
    const minDelay = 40, maxDelay = 120;
    let i = 0;
    let current = '';
    let totalTime = 0;
    const delays = [];
    // Calcule un délai pour chaque mot pour tenir dans la durée totale
    const baseDelay = Math.max(totalDuration / wordCount, minDelay);
    for (let w = 0; w < wordCount; w++) {
      let d = baseDelay + Math.random() * (maxDelay - minDelay);
      delays.push(d);
      totalTime += d;
    }
    // Ajuste si on dépasse la durée max
    const scale = totalDuration / totalTime;
    for (let w = 0; w < wordCount; w++) delays[w] *= scale;

    function typeNext() {
      if (i < wordCount) {
        current += (i > 0 ? ' ' : '') + words[i];
        el.innerHTML = current + '<span class="typewriter-cursor">|</span>';
        setTimeout(typeNext, delays[i]);
        i++;
      } else {
        el.innerHTML = current;
        if (repeat) setTimeout(startTypewriter, pause || 800); // Pause personnalisée
      }
    }
    typeNext();
  }
  if (!running) {
    running = true;
    startTypewriter();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  typeWriterExpert(
    '.typewriter-expert',
    "Cheffe de projet passionnée par l’innovation, la gestion d’équipe et la transformation digitale.\n\nMon objectif est de mener à bien chaque projet en respectant les délais et le budget, tout en coordonnant efficacement les différents acteurs impliqués. En tant que référente numérique, j'assure la transition vers de nouvelles pratiques numériques en identifiant et accompagnant la création de solutions innovantes.",
    20000, // Durée totale en ms (20 secondes)
    true,  // Répétitif
    5000   // Pause de 5 secondes avant de recommencer
  );
});

// Style curseur animé
const style = document.createElement('style');
style.innerHTML = `.typewriter-cursor { display:inline-block; width:1ch; color:#ffd700; animation: blink-cursor 0.7s steps(1) infinite; }
@keyframes blink-cursor { 0%,100%{opacity:1;} 50%{opacity:0;} }`;
document.head.appendChild(style);

// Animation flottante au scroll pour les cards de compétences
function revealSkillCardsOnScroll() {
  const cards = document.querySelectorAll('.skill-card, .skill-card-3d');
  const windowHeight = window.innerHeight;
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < windowHeight - 60) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  });
}
window.addEventListener('scroll', revealSkillCardsOnScroll);
window.addEventListener('resize', revealSkillCardsOnScroll);
document.addEventListener('DOMContentLoaded', revealSkillCardsOnScroll);
