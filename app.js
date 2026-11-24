/**
 * Interactive Features & Animations for Wedding Invitation
 * - Floating Rose Petal Physics Canvas
 * - Live Countdown Timer
 * - Dynamic QR Code Generator
 * - RSVP Form with Celebratory Confetti & Local Storage
 * - Ambient Music Controller with synthesized romantic harp chords (Web Audio API)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initCountdown();
  initRSVP();
  initAmbientAudio();
  initScrollAnimations();
});

/* -------------------------------------------------------------
   1. Interactive Floating Rose Petals Animation (Canvas)
-------------------------------------------------------------- */
function initPetalCanvas() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 35; // optimal for smooth 60fps performance
  const petalColors = [
    'rgba(244, 182, 193, 0.75)',
    'rgba(235, 148, 163, 0.65)',
    'rgba(255, 218, 224, 0.7)',
    'rgba(224, 122, 134, 0.6)'
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 10 + 10; // 10 to 20
      this.speedY = Math.random() * 1.2 + 0.8; // fall speed
      this.speedX = Math.random() * 1.5 - 0.75; // gentle horizontal drift
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.2;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationDist = Math.random() * 30 + 10;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.angle += this.oscillationSpeed;
      this.x += this.speedX + Math.sin(this.angle) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      ctx.fillStyle = this.color;
      // Draw organic petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------
   2. Live Wedding Countdown Timer
-------------------------------------------------------------- */
function initCountdown() {
  // Target wedding date: March 4, 2027 at 20:30 (Borjatri Jatra & Wedding)
  const targetDate = new Date('March 4, 2027 20:30:00').getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = pad(days);
    if (hEl) hEl.innerText = pad(hours);
    if (mEl) mEl.innerText = pad(minutes);
    if (sEl) sEl.innerText = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------
   3. Dynamic Mobile QR Code Generation
-------------------------------------------------------------- */
function initQRCode() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer || typeof QRCode === 'undefined') return;

  // Real-time page URL
  const currentUrl = window.location.href || 'https://jyotishman-weds.invitation.site';

  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: currentUrl,
    width: 170,
    height: 170,
    colorDark: '#793540',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

/* -------------------------------------------------------------
   4. Interactive RSVP & Wishes Submission (blessings.json + Firestore Sync)
-------------------------------------------------------------- */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-container');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const downloadBtn = document.getElementById('download-json-btn');

  // Load existing wishes from localStorage
  let savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');

  function renderWishes(wishes) {
    if (!wishesList) return;
    wishesList.innerHTML = wishes.map(w => `
      <div class="p-4 bg-white/75 rounded-2xl border border-rose-100 shadow-sm flex flex-col gap-1.5 transition-all hover:bg-white fade-on-scroll">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-rose-800 tracking-wide font-serif-title text-base">${escapeHtml(w.name || 'Well-wisher')}</span>
          <span class="text-rose-400 font-sans text-[11px]">${escapeHtml(w.time || 'Today')}</span>
        </div>
        <p class="text-stone-600 text-sm italic font-sans leading-relaxed">"${escapeHtml(w.message || '')}"</p>
      </div>
    `).join('');
  }

  // Load blessings from Google Sheet API if available, else blessings.json
  const sheetApiUrl = window.GOOGLE_SHEET_API_URL || '';

  if (sheetApiUrl) {
    fetch(sheetApiUrl)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          savedWishes = data;
          localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
          renderWishes(savedWishes);
        }
      })
      .catch(() => {
        loadLocalBlessings();
      });
  } else {
    loadLocalBlessings();
  }

  function loadLocalBlessings() {
    if (savedWishes.length === 0) {
      fetch('blessings.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            savedWishes = data;
            localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
            renderWishes(savedWishes);
          }
        })
        .catch(() => {
          savedWishes = [
            { name: 'Parag & Nilakshi', message: 'Jyotishman aru Nitumoniloi biyar xubhesa thakil! Always stay blessed! 💕🌸', time: 'Just now' },
            { name: 'Bhaskar Jyoti & Family', message: 'A lifetime of happiness, harmony and endless love together! ✨🥂', time: '1 hr ago' }
          ];
          renderWishes(savedWishes);
        });
    } else {
      renderWishes(savedWishes);
    }
  }

  // Export / Download blessings as blessings.json file
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedWishes, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "blessings.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Live Character Validation UX (Blessings min 10 chars)
  const nameInput = document.getElementById('rsvp-name');
  const msgInput = document.getElementById('rsvp-message');
  const msgCounter = document.getElementById('msg-counter');
  // Honeypot element for anti-spam
  const honeypotEl = document.getElementById('honeypot_website');

  if (msgInput && msgCounter) {
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.trim().length;
      if (len < 10) {
        msgCounter.innerText = `${len}/10 chars min`;
        msgCounter.classList.add('text-amber-600');
        msgCounter.classList.remove('text-emerald-600', 'text-stone-400');
      } else {
        msgCounter.innerText = `✓ ${len} chars`;
        msgCounter.classList.remove('text-amber-600', 'text-stone-400');
        msgCounter.classList.add('text-emerald-600');
      }
    });
  }

  // Silent Rate Limiting (Coool-down protection without intrusive banner)
  const COOLDOWN_SECONDS = 30;

  function checkCooldown() {
    const lastSubmit = parseInt(localStorage.getItem('last_blessing_submit') || '0', 10);
    const now = Date.now();
    const elapsed = Math.floor((now - lastSubmit) / 1000);
    return elapsed >= COOLDOWN_SECONDS ? 0 : (COOLDOWN_SECONDS - elapsed);
  }

  // Update button state cleanly if user recently submitted
  function updateButtonState() {
    const remaining = checkCooldown();
    if (remaining > 0 && submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = `Please wait ${remaining}s...`;
      setTimeout(updateButtonState, 1000);
    } else if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Send Your Blessings';
    }
  }

  updateButtonState();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Silent Rate Limiting Check
      const remaining = checkCooldown();
      if (remaining > 0) {
        alert(`Please wait ${remaining} seconds before sending another blessing.`);
        updateButtonState();
        return;
      }

      // Honeypot check
      if (honeypotEl && honeypotEl.value.trim() !== '') {
        console.warn("Spam bot trapped by honeypot.");
        form.reset();
        return;
      }

      const name = nameInput.value.trim();
      const rawMessage = msgInput.value.trim();

      if (!name || !rawMessage) return;

      if (rawMessage.length < 10) {
        alert('Please enter at least 10 characters for your blessing message.');
        msgInput.focus();
        return;
      }

      // Block URL links
      if (/https?:\/\/|<script|www\./i.test(rawMessage) || /https?:\/\/|<script|www\./i.test(name)) {
        alert('Links and web addresses are not permitted in wedding blessings.');
        return;
      }

      // Add a random celebratory romantic emoji with the blessing
      const blessingEmojis = ['💐', '🌸', '✨', '💕', '🥂', '🌹', '🕊️', '💍', '🎉', '💖'];
      const randomEmoji = blessingEmojis[Math.floor(Math.random() * blessingEmojis.length)];
      const finalMessage = `${rawMessage} ${randomEmoji}`;

      // Record successful submit timestamp
      localStorage.setItem('last_blessing_submit', Date.now().toString());

      const newWish = {
        id: Date.now(),
        name: name,
        message: finalMessage,
        date: new Date().toISOString().split('T')[0],
        time: 'Just now'
      };

      // Send to Google Sheet if API URL configured
      if (sheetApiUrl) {
        // Use FormData / text/plain with no-cors to prevent preflight blocking
        // Send as standard form data or plain text
        try {
          const payload = JSON.stringify({ name: name, message: finalMessage });
          fetch(sheetApiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: payload
          }).catch(err => console.log('Sheet post error:', err));
        } catch (err) {
          console.log('Error triggering sheet post:', err);
        }
      }

      // Update local list & localStorage
      savedWishes.unshift(newWish);
      localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
      renderWishes(savedWishes);

      // Trigger Celebration Confetti
      triggerConfetti();

      // Show Thank You Feedback Modal
      const modalSuccess = document.getElementById('rsvp-success');
      if (modalSuccess) {
        modalSuccess.classList.remove('hidden');
        modalSuccess.classList.add('flex');
      }

      form.reset();
      if (msgCounter) msgCounter.innerText = 'Min 10 chars';
      if (msgCounter) msgCounter.className = 'text-[11px] font-mono text-stone-400';

      // Activate clean button countdown without showing any intrusive banners
      updateButtonState();
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function closeSuccessModal() {
  const modalSuccess = document.getElementById('rsvp-success');
  if (modalSuccess) {
    modalSuccess.classList.add('hidden');
    modalSuccess.classList.remove('flex');
  }
}

/* Confetti Burst */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e07a86', '#d89f78', '#fff1f2', '#f43f5e']
    });
  }
}

/* -------------------------------------------------------------
   5. Romantic Ambient Music Controller
   - Plays high-quality romantic piano melody (`assets/wedding-romantic.mp3`)
   - Auto-fades volume smoothly & supports first-user-gesture autoplay
-------------------------------------------------------------- */
function initAmbientAudio() {
  const toggleBtn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  const audioElement = document.getElementById('wedding-audio');
  const statusText = document.getElementById('music-status-text');

  const musicTooltip = document.getElementById('music-tooltip');

  if (!toggleBtn || !audioElement) return;

  if (musicTooltip) {
    musicTooltip.addEventListener('click', togglePlay);
  }

  audioElement.volume = 0.45; // Gentle, relaxing volume level
  let isPlaying = false;

  function updateUI(playing) {
    if (playing) {
      toggleBtn.classList.add('bg-rose-600', 'text-white', 'border-rose-600', 'shadow-rose-300', 'animate-romantic-pulse');
      toggleBtn.classList.remove('bg-white/95', 'text-rose-600', 'border-rose-300');
      if (statusText) statusText.innerText = 'Now Playing: উৰুলীৰ মংগল ধ্বনি 🎶';
      if (icon) {
        icon.innerHTML = `
          <!-- Pause / Equalizer Icon -->
          <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;
      }
    } else {
      toggleBtn.classList.remove('bg-rose-600', 'text-white', 'border-rose-600', 'shadow-rose-300', 'animate-romantic-pulse');
      toggleBtn.classList.add('bg-white/95', 'text-rose-600', 'border-rose-300');
      if (statusText) statusText.innerText = 'Play Wedding Biya Naam 🎶';
      if (icon) {
        icon.innerHTML = `
          <!-- Play Icon -->
          <svg class="w-6 h-6 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;
      }
    }
  }

  function togglePlay() {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      updateUI(false);
    } else {
      audioElement.play().then(() => {
        isPlaying = true;
        updateUI(true);
      }).catch((err) => {
        console.log("Audio play blocked by browser policy:", err);
      });
    }
  }

  toggleBtn.addEventListener('click', togglePlay);

  // 1. Try immediate autoplay (Works if user interacted or browser permits)
  const playPromise = audioElement.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      updateUI(true);
    }).catch(() => {
      // Modern browsers (Chrome/Safari/iOS/Android) block unmuted audio without gesture
      isPlaying = false;
      updateUI(false);
    });
  }

  // 2. Play on user interaction across the window
  // Note: Modern browsers (Chrome, Safari, iOS, Android) strictly disallow unmuted audio on pure 'scroll'
  // events without a direct input gesture (click, pointerdown, touchstart, keydown).
  // Therefore, we keep listening until an allowed gesture successfully starts playback.
  const gestureEvents = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click', 'scroll', 'wheel'];

  const triggerAudioOnGesture = () => {
    if (isPlaying) return;

    audioElement.play().then(() => {
      isPlaying = true;
      updateUI(true);
      // Remove all event listeners only after play has successfully started!
      gestureEvents.forEach(evt => {
        window.removeEventListener(evt, triggerAudioOnGesture, true);
        document.removeEventListener(evt, triggerAudioOnGesture, true);
      });
    }).catch((e) => {
      // If browser rejects (e.g. scroll without gesture), do not remove listeners yet!
      // Keep listeners active so next tap/click/touch will start the music.
      console.log('Autoplay waiting for valid user gesture (tap/click):', e?.message || e);
    });
  };

  gestureEvents.forEach(evt => {
    window.addEventListener(evt, triggerAudioOnGesture, { capture: true, passive: true });
    document.addEventListener(evt, triggerAudioOnGesture, { capture: true, passive: true });
  });
}

/* -------------------------------------------------------------
   6. Reveal on Scroll Animation (IntersectionObserver)
-------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
}

