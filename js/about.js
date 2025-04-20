// Deteksi performa perangkat
function detectPerformance() {
    // Deteksi perangkat low-end
    const isLowEndDevice = () => {
        const processors = navigator.hardwareConcurrency || 1;
        const limitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        return processors <= 2 || limitedMemory;
    };
    
    // Deteksi koneksi lambat
    const isSlowConnection = () => {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.saveData);
        }
        return false;
    };
    
    // Sesuaikan berdasarkan perangkat dan koneksi
    if (isLowEndDevice() || isSlowConnection()) {
        document.body.classList.add('low-performance');
    }
    
    // Tentukan jumlah elemen hujan berdasarkan performa
    return {
        rainDrops: isLowEndDevice() ? 20 : 50,
        footerRainDrops: isLowEndDevice() ? 10 : 25
    };
}

// Optimasi: Fungsi untuk membuat efek hujan yang lebih ringan
function createRain() {
    const rainContainer = document.querySelector('.rain-container');
    const rainFooter = document.querySelector('.rain-footer');
    
    if (!rainContainer || !rainFooter) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.rainDrops;
    const footerDrops = performanceSettings.footerRainDrops;
    
    // Bersihkan container yang sudah ada
    rainContainer.innerHTML = '';
    rainFooter.innerHTML = '';
    
    // Menggunakan fragments untuk mengurangi DOM reflow
    const mainFragment = document.createDocumentFragment();
    const footerFragment = document.createDocumentFragment();
    
    // Buat hujan utama dengan jumlah yang sudah disesuaikan
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = createRainDrop(true);
        mainFragment.appendChild(drop);
    }
    
    // Buat hujan footer dengan jumlah yang lebih sedikit
    for (let i = 0; i < footerDrops; i++) {
        const drop = createRainDrop(false);
        footerFragment.appendChild(drop);
    }
    
    // Tambahkan fragments ke container
    rainContainer.appendChild(mainFragment);
    rainFooter.appendChild(footerFragment);
}

// Fungsi untuk membuat tetesan hujan individual
function createRainDrop(isMainRain) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // Random position
    const posX = Math.floor(Math.random() * window.innerWidth);
    drop.style.left = posX + 'px';
    
    // Random falling speed
    const fallDuration = isMainRain ? 
        (0.8 + Math.random() * 0.7) : 
        (0.5 + Math.random() * 0.5);
    drop.style.animationDuration = fallDuration + 's';
    
    // Random opacity
    const opacity = isMainRain ? 
        (0.2 + Math.random() * 0.4) : 
        (0.1 + Math.random() * 0.3);
    drop.style.opacity = opacity;
    
    // Random size
    const size = isMainRain ? 
        (1 + Math.random()) : 
        (0.5 + Math.random() * 0.5);
    drop.style.width = size + 'px';
    drop.style.height = isMainRain ? (size * 15) + 'px' : (size * 10) + 'px';
    
    // Tambahkan efek hujan miring hanya untuk sebagian tetesan
    if (Math.random() > 0.7) {
        drop.style.animation = `rain-fall-angled ${fallDuration}s linear infinite`;
    }
    
    return drop;
}

// Optimasi: Fungsi hover effect yang lebih ringan
function setupHoverEffects() {
    const educationCards = document.querySelectorAll('.education-card');
    
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            educationCards.forEach(c => {
                if (c !== this) {
                    c.classList.add('dimmed');
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            educationCards.forEach(c => {
                c.classList.remove('dimmed');
            });
        });
    });
}

// Optimasi: Fungsi reveal on scroll yang lebih efisien dengan requestAnimationFrame
function revealOnScroll() {
    // Gunakan requestAnimationFrame untuk sinkronisasi dengan refresh rate browser
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const educationCards = document.querySelectorAll('.education-card:not(.active)');
        const experienceCards = document.querySelectorAll('.experience-card:not(.active)');
        
        // Optimasi: Cache hasil innerHeight untuk performa
        const viewportHeight = window.innerHeight;
        
        // Fungsi cek apakah elemen dalam viewport
        function isInViewport(element, offset = 100) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= viewportHeight - offset && 
                rect.bottom >= 0
            );
        }
        
        // Animasi elemen umum
        reveals.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        // Animasi kartu pendidikan
        educationCards.forEach((card, index) => {
            if (isInViewport(card, 50)) {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 100);
            }
        });
        
        // Animasi kartu pengalaman
        experienceCards.forEach((card, index) => {
            if (isInViewport(card, 50)) {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 150);
            }
        });
    });
}

// Optimasi: Fungsi transisi halaman yang lebih ringan
function setupPageTransitions() {
    const transitionLinks = document.querySelectorAll('a[data-transition="true"]');
    const overlay = document.querySelector('.page-transition-overlay');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            overlay.classList.add('active');
            
            setTimeout(() => {
                sessionStorage.setItem('internalNavigation', 'true');
                window.location.href = target;
            }, 300);
        });
    });
}

// Optimasi: Fungsi scroll yang lebih efisien dengan throttling
function throttle(func, delay) {
    let lastCall = 0;
    return function() {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func.apply(this, arguments);
    }
}

// Visibilty API untuk mengoptimalkan halaman saat tidak terlihat
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Pause animations ketika halaman tidak terlihat
        document.body.classList.add('animation-paused');
    } else {
        // Resume animations ketika halaman terlihat kembali
        document.body.classList.remove('animation-paused');
    }
}

// DOMContentLoaded event - setup minimal awal
document.addEventListener('DOMContentLoaded', function() {
    // Setup transisi halaman 
    setupPageTransitions();
    
    // Dengarkan perubahan visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Inisialisasi saat halaman selesai dimuat
window.addEventListener('load', function() {
    // Hapus overlay
    const overlay = document.querySelector('.page-transition-overlay');
    overlay.classList.remove('active');
    
    // Buat efek hujan
    createRain();
    
    // Setup efek hover
    setupHoverEffects();
    
    // Check elemen dalam viewport
    revealOnScroll();
    
    // Tambahkan event listener scroll dengan throttling untuk performa
    window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
});