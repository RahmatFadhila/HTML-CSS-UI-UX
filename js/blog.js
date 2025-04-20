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
        rainDrops: isLowEndDevice() ? 20 : 40,
        postRainDrops: isLowEndDevice() ? 5 : 15
    };
}

// Optimasi: Fungsi untuk membuat efek hujan yang lebih ringan
function createRain() {
    const rain = document.querySelector('.rain');
    if (!rain) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.rainDrops;
    
    // Bersihkan container yang mungkin sudah ada
    rain.innerHTML = '';
    
    // Menggunakan fragment untuk mengurangi reflow
    const fragment = document.createDocumentFragment();
    
    // Buat hujan dengan jumlah yang sudah disesuaikan dengan performa
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        
        // Random position
        const posX = Math.floor(Math.random() * window.innerWidth);
        drop.style.left = posX + 'px';
        
        // Random falling speed
        const fallDuration = 0.8 + Math.random() * 0.7;
        drop.style.animationDuration = fallDuration + 's';
        
        // Random opacity
        const opacity = 0.2 + Math.random() * 0.4;
        drop.style.opacity = opacity;
        
        // Random size
        const size = 1 + Math.random();
        drop.style.width = size + 'px';
        drop.style.height = (size * 10) + 'px';
        
        fragment.appendChild(drop);
    }
    
    rain.appendChild(fragment);
}

// Optimasi: Fungsi untuk membuat hujan pada card post yang lebih ringan
function createPostRain() {
    const postRainContainers = document.querySelectorAll('.post-image-rain');
    if (!postRainContainers.length) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.postRainDrops;
    
    postRainContainers.forEach(container => {
        // Bersihkan container
        container.innerHTML = '';
        
        // Menggunakan fragment untuk mengurangi reflow
        const fragment = document.createDocumentFragment();
        
        // Buat hujan untuk setiap card post
        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement('div');
            drop.className = 'post-rain-drop';
            
            // Random position
            const posX = Math.floor(Math.random() * 100);
            drop.style.left = posX + '%';
            
            // Random falling speed
            const fallDuration = 0.8 + Math.random() * 0.7;
            drop.style.animationDuration = fallDuration + 's';
            
            // Random opacity
            const opacity = 0.3 + Math.random() * 0.4;
            drop.style.opacity = opacity;
            
            // Random size
            const size = 1 + Math.random() * 0.5;
            drop.style.width = size + 'px';
            drop.style.height = (size * 8) + 'px';
            
            fragment.appendChild(drop);
        }
        
        container.appendChild(fragment);
    });
}

// Optimasi: Fungsi untuk membuat efek kilat yang lebih ringan
function createLightningEffects() {
    const lightningContainers = document.querySelectorAll('.lightning-container');
    if (!lightningContainers.length) return;
    
    // Gunakan fungsi throttle untuk membatasi frequensi flash kilat
    const createLightningFlash = (container) => {
        // Jika halaman tidak terlihat atau performa rendah, jangan buat efek
        if (document.visibilityState === 'hidden' || document.body.classList.contains('low-performance')) {
            return;
        }
        
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        lightning.style.left = posX + '%';
        lightning.style.top = posY + '%';
        
        container.appendChild(lightning);
        
        // Hapus elemen kilat setelah animasi selesai
        setTimeout(() => { 
            if (lightning.parentNode === container) {
                lightning.remove();
            }
        }, 200);
    };
    
    // Timer untuk efek kilat - satu timer bersama untuk semua container
    setInterval(() => {
        // Hanya jalankan jika visible dan random chance
        if (document.visibilityState === 'visible' && Math.random() > 0.7) {
            // Pilih salah satu container secara acak
            const randomIndex = Math.floor(Math.random() * lightningContainers.length);
            createLightningFlash(lightningContainers[randomIndex]);
        }
    }, 8000);
}

// Optimasi: Fungsi throttle untuk scroll optimization
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

// Fungsi untuk menampilkan elemen saat di-scroll dengan requestAnimationFrame
function revealOnScroll() {
    // Gunakan requestAnimationFrame untuk optimasi
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const blogPosts = document.querySelectorAll('.blog-post:not(.active)');
        const categoryCard = document.querySelector('.category-card:not(.active)');
        
        // Cache hasil innerHeight untuk performa
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
        
        // Animasi blog posts dengan staggered delay
        blogPosts.forEach((post, index) => {
            if (isInViewport(post, 50)) {
                setTimeout(() => {
                    post.classList.add('active');
                }, index * 100);
            }
        });
        
        // Animasi category card
        if (categoryCard && isInViewport(categoryCard, 50)) {
            categoryCard.classList.add('active');
        }
    });
}

// Optimasi: Fungsi untuk tombol Read More yang lebih efisien
function setupReadMoreButtons() {
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            card.classList.toggle('expanded');
            
            const readMoreText = this.querySelector('.read-more-text');
            const arrowIcon = this.querySelector('svg');
            
            if (card.classList.contains('expanded')) {
                readMoreText.textContent = 'Read Less';
                arrowIcon.style.transform = 'rotate(180deg)';
                
                // Smooth scroll to show full content
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                readMoreText.textContent = 'Read More';
                arrowIcon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Optimasi: Fungsi transisi halaman
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

// Fungsi yang menangani visibilitas halaman
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Jeda animasi saat halaman tidak terlihat
        document.body.classList.add('animation-paused');
    } else {
        // Lanjutkan animasi saat halaman terlihat kembali
        document.body.classList.remove('animation-paused');
    }
}

// Minimal setup pada DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup page transitions
    setupPageTransitions();
    
    // Listener for visibility API
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Inisialisasi lengkap pada window load
window.addEventListener('load', function() {
    // Hapus overlay
    const overlay = document.querySelector('.page-transition-overlay');
    overlay.classList.remove('active');
    
    // Buat efek visual
    setTimeout(() => {
        createRain();
        createPostRain();
        createLightningEffects();
    }, 100);
    
    // Setup interaksi
    setupReadMoreButtons();
    
    // Check elemen dalam viewport
    revealOnScroll();
    
    // Tambahkan event listener scroll dengan throttling untuk performa lebih baik
    window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
});