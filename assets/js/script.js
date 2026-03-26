// Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.5 ? '#fb923c' : '#22d3ee',
        shape: Math.random() > 0.8 ? 'triangle' : 'circle'
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x = (p.x + p.speedX + canvas.width) % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        ctx.beginPath();
        if (p.shape === 'triangle') {
            ctx.moveTo(p.x, p.y - p.size);
            ctx.lineTo(p.x - p.size, p.y + p.size);
            ctx.lineTo(p.x + p.size, p.y + p.size);
            ctx.closePath();
        } else { ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(34,211,238,${0.08 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

// Audio bars
const barsContainer = document.getElementById('audioBars');

if (barsContainer) {
    const bars = [];
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '40%';
        bar.style.backgroundColor = i % 3 === 0 ? '#fb923c' : '#22d3ee';
        bar.style.opacity = '0.6';
        barsContainer.appendChild(bar);
        bars.push(bar);
    }
    bars.forEach(bar => {
        const animate = () => {
            const h = 20 + Math.random() * 80;
            bar.style.height = h + '%';
            bar.style.opacity = 0.4 + (h / 100) * 0.6;
            setTimeout(animate, 400 + Math.random() * 600);
        };
        animate();
    });
}

// -------------------- LOCAL AUDIO PLAYLIST --------------------
const audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;

// Your local MP3 files
const playlist = [
    'assets/audio/collision.mp3',
    'assets/audio/full-belly.mp3',
    'assets/audio/push-up.mp3',
    'assets/audio/run-it-back-twice.mp3',
    'assets/audio/plastikman.mp3'
];

let currentTrack = 0;

// Load first track
//audioPlayer.src = playlist[currentTrack];

// When a song ends → next one
audioPlayer.addEventListener('ended', () => {
    playNextTrack();
});

function playNextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    audioPlayer.src = playlist[currentTrack];
    audioPlayer.play();
    isPlaying = true;
    updateButton();
}

function updateButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (!soundBtn) return;

    if (isPlaying) {
        soundBtn.textContent = "■ Arrêter le son";
        soundBtn.classList.add('playing');
    } else {
        soundBtn.textContent = "▶ Activer le son ambient";
        soundBtn.classList.remove('playing');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('soundBtn');
    const skipBtn = document.getElementById('skipBtn');

    // ✅ LOAD FIRST TRACK
    audioPlayer.src = playlist[currentTrack];

    // Play / Pause
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            if (isPlaying) {
                audioPlayer.pause();
                isPlaying = false;
            } else {
                audioPlayer.play().catch(() => { });
                isPlaying = true;
            }
            updateButton();
        });
    }

    // Skip
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            playNextTrack();
        });
    }
});
