// Deteksi performa perangkat untuk menyesuaikan efek
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
        rainDrops: isLowEndDevice() ? 20 : 30,
        profileRainDrops: isLowEndDevice() ? 8 : 15
    };
}

// Fungsi untuk menyembunyikan animasi entrance yang lebih sederhana
function hideEntranceAnimation() {
    const entranceAnimation = document.getElementById('entranceAnimation');
    if (!entranceAnimation) return;
    
    entranceAnimation.style.opacity = '0';
    
    setTimeout(() => {
        entranceAnimation.style.display = 'none';
        sessionStorage.setItem('entranceSeen', 'true');
    }, 500);
}

// Fungsi untuk menampilkan elemen halaman dengan animasi
function animatePageElements() {
    const elements = document.querySelectorAll('.page-element');
    elements.forEach(element => {
        element.classList.add('visible');
    });
}

// Memindahkan createRainDrop ke luar sebagai helper function untuk mengurangi duplikasi
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
    
    // Tambahkan animasi miring untuk beberapa drops
    if (Math.random() > 0.7) {
        drop.style.animation = `rain-fall-angled ${fallDuration}s linear infinite`;
    }
    
    return drop;
}

// Fungsi untuk membuat efek hujan utama
function createRain() {
    const rainContainer = document.querySelector('.rain-container');
    const rainFooter = document.querySelector('.rain-footer');
    if (!rainContainer || !rainFooter) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.rainDrops;
    
    // Hapus semua elemen yang mungkin sudah ada
    rainContainer.innerHTML = '';
    rainFooter.innerHTML = '';
    
    // Menggunakan fragments untuk performa lebih baik
    const mainFragment = document.createDocumentFragment();
    const footerFragment = document.createDocumentFragment();
    
    // Buat rain drops untuk container utama
    for (let i = 0; i < numberOfDrops; i++) {
        mainFragment.appendChild(createRainDrop(true));
    }
    
    // Buat rain drops untuk footer
    for (let i = 0; i < numberOfDrops / 2; i++) {
        footerFragment.appendChild(createRainDrop(false));
    }
    
    rainContainer.appendChild(mainFragment);
    rainFooter.appendChild(footerFragment);
}

// Fungsi untuk membuat hujan di sekitar profil
function createProfileRain() {
    const profileRain = document.querySelector('.profile-rain');
    if (!profileRain) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.profileRainDrops;
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.className = 'profile-rain-drop';
        
        // Posisi
        const posX = Math.floor(Math.random() * 100);
        drop.style.left = posX + '%';
        
        // Kecepatan jatuh
        const fallDuration = 0.8 + Math.random();
        drop.style.animationDuration = fallDuration + 's';
        
        // Ukuran
        const size = 1 + Math.random();
        drop.style.width = size + 'px';
        drop.style.height = (size * 6) + 'px';
        
        fragment.appendChild(drop);
    }
    
    profileRain.appendChild(fragment);
}

// Fungsi untuk creating lightning effect
function createLightning() {
    const lightningContainer = document.querySelector('.lightning-container');
    if (!lightningContainer) return;
    
    // Fungsi untuk menambahkan kilat
    const addLightning = () => {
        // Jika mode performa rendah, kurangi efek kilat
        if (document.body.classList.contains('low-performance')) {
            return;
        }
        
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        
        // Random posisi
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        lightning.style.left = posX + '%';
        lightning.style.top = posY + '%';
        
        lightningContainer.appendChild(lightning);
        
        // Hapus elemen kilat setelah animasi selesai
        setTimeout(() => {
            if (lightning.parentNode === lightningContainer) {
                lightningContainer.removeChild(lightning);
            }
        }, 200);
    };
    
    // Tambahkan kilat secara acak
    const interval = setInterval(() => {
        // Hanya tambahkan kilat jika halaman terlihat
        if (document.visibilityState === 'visible' && Math.random() > 0.7) {
            addLightning();
        }
    }, 5000);
    
    // Simpan interval ke window agar bisa dibersihkan saat dibutuhkan
    window.lightningInterval = interval;
}

// Fungsi untuk mengatur transisi halaman
function setupPageTransitions() {
    const transitionLinks = document.querySelectorAll('a[data-transition="true"]');
    const overlay = document.querySelector('.page-transition-overlay');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            overlay.classList.add('active');
            
            // Navigasi setelah animasi overlay
            setTimeout(() => {
                sessionStorage.setItem('internalNavigation', 'true');
                window.location.href = target;
            }, 300);
        });
    });
}

// Fungsi untuk mengoptimalkan animasi selama scroll
function optimizeOnScroll() {
    // Menggunakan throttling untuk optimasi
    let scrollThrottleTimeout;
    const throttleDuration = 100;
    
    window.addEventListener('scroll', () => {
        // Skip jika sudah dalam throttle
        if (scrollThrottleTimeout) return;
        
        // Tambahkan class reduced ke container hujan
        document.body.classList.add('reduced');
        
        scrollThrottleTimeout = setTimeout(() => {
            // Hapus class setelah scroll selesai
            clearTimeout(window.scrollEndTimeout);
            window.scrollEndTimeout = setTimeout(() => {
                document.body.classList.remove('reduced');
                scrollThrottleTimeout = null;
            }, 300);
            
        }, throttleDuration);
    }, { passive: true });
}

// Fungsi callback visibility API
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Pause animations when page is not visible
        document.body.classList.add('animation-paused');
    } else {
        // Resume animations when page is visible again
        document.body.classList.remove('animation-paused');
    }
}

// DOMContentLoaded event - minimal initial setup
document.addEventListener('DOMContentLoaded', function() {
    // Setup page transitions only - delaying rest to after load
    setupPageTransitions();
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Load event - complete initialization after everything loaded
window.addEventListener('load', function() {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    const entranceAnimation = document.getElementById('entranceAnimation');
    const entranceSeen = sessionStorage.getItem('entranceSeen');
    const internalNavigation = sessionStorage.getItem('internalNavigation');
    
    // Optimize for animation on scroll
    optimizeOnScroll();
    
    // Delayed initialization based on navigation type
    if (internalNavigation) {
        // Internal navigation - remove flag
        sessionStorage.removeItem('internalNavigation');
        
        if (entranceAnimation) {
            entranceAnimation.style.display = 'none';
        }
        
        // Animasikan elemen halaman
        requestAnimationFrame(animatePageElements);
        
        // Create rain effects with slight delay
        setTimeout(() => {
            createRain();
            createProfileRain();
            createLightning();
        }, 300);
    } else {
        if (entranceSeen) {
            // Skip entrance for returning visitors
            if (entranceAnimation) {
                entranceAnimation.style.display = 'none';
            }
            
            requestAnimationFrame(animatePageElements);
            
            // Create rain effects with slight delay
            setTimeout(() => {
                createRain();
                createProfileRain();
                createLightning();
            }, 300);
        } else {
            // First visit - show entrance
            // Hide entrance after a short time
            setTimeout(() => {
                hideEntranceAnimation();
                
                // Animate page elements
                requestAnimationFrame(animatePageElements);
                
                // Create rain effects
                setTimeout(() => {
                    createRain();
                    createProfileRain();
                    createLightning();
                }, 300);
            }, 1500); // Reduced from 3000 to 1500
        }
    }
});