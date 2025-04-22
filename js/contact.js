// Inisialisasi EmailJS
(function() {
    emailjs.init("f177BWx_Ra4rmjmrJ"); // Ganti dengan public key EmailJS Anda
})();

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
        rainDrops: isLowEndDevice() ? 20 : 40
    };
}

// Optimasi: Fungsi untuk membuat efek hujan yang lebih ringan dengan DocumentFragment
function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain';
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.rainDrops;
    
    // Menggunakan fragment untuk mengurangi reflow DOM
    const fragment = document.createDocumentFragment();
    
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
        
        // Tambahkan efek hujan miring hanya untuk sebagian tetesan
        if (Math.random() > 0.7) {
            drop.style.animation = `rain-fall-angled ${fallDuration}s linear infinite`;
        }
        
        fragment.appendChild(drop);
    }
    
    rainContainer.appendChild(fragment);
    document.body.appendChild(rainContainer);
}

// Optimasi: Fungsi scroll reveal dengan throttling
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
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const formRows = document.querySelectorAll('.form-row:not(.active), .form-group.full-width:not(.active)');
        const testimonials = document.querySelectorAll('.testimonial:not(.active)');
        
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
        
        // Animasi form rows dengan staggered delay
        formRows.forEach((row, index) => {
            if (isInViewport(row, 50)) {
                setTimeout(() => {
                    row.classList.add('active');
                }, index * 100);
            }
        });
        
        // Animasi testimonials dengan staggered delay
        testimonials.forEach((testimonial, index) => {
            if (isInViewport(testimonial, 50)) {
                setTimeout(() => {
                    testimonial.classList.add('active');
                }, index * 150);
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

// Fungsi untuk menangani visibility API
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Jeda animasi saat tab tidak aktif
        document.body.classList.add('animation-paused');
    } else {
        // Lanjutkan animasi saat tab aktif kembali
        document.body.classList.remove('animation-paused');
    }
}

// Fungsi untuk mengirim email 
function sendEmail(formData) {
    // Konfigurasikan dengan ID service dan template Anda
    const serviceID = 'service_ozhez6k'; // Ganti dengan service ID EmailJS Anda
    const templateID = 'template_4xqif1s'; // Ganti dengan template ID EmailJS Anda
    
    // Kirim email menggunakan EmailJS
    return emailjs.send(serviceID, templateID, {
        from_name: formData.name,
        reply_to: formData.email,
        subject: formData.subject,
        message: formData.message
    });
}

// Setup dasar pada DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup page transitions
    setupPageTransitions();
    
    // Setup visibility event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Tambahkan event listener untuk form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah pengiriman form default
            
            // Ambil data form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Sembunyikan form dengan animasi
            const formElements = this.querySelectorAll('.form-row, .form-group.full-width');
            formElements.forEach(element => {
                element.style.opacity = '0';
            });
            
            // Tampilkan pesan terima kasih
            setTimeout(() => {
                formElements.forEach(element => {
                    element.classList.add('form-hidden');
                });
                document.getElementById('thankYouMessage').classList.add('active');
                
                // Kirim email
                sendEmail(formData)
                    .then(function() {
                        console.log('Email berhasil dikirim!');
                    })
                    .catch(function(error) {
                        console.error('Gagal mengirim email:', error);
                    });
            }, 500);
        });
    }
});

// Inisialisasi penuh saat window load
window.addEventListener('load', function() {
    // Hapus overlay
    const overlay = document.querySelector('.page-transition-overlay');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (overlay) overlay.classList.remove('active');
    if (loadingIndicator) loadingIndicator.classList.remove('active');
    
    // Buat efek hujan dengan delay untuk performa lebih baik
    setTimeout(() => {
        createRain();
    }, 100);
    
    // Initial check untuk elemen dalam viewport
    revealOnScroll();
    
    // Tambahkan event listener scroll dengan throttling untuk performa lebih baik
    window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
});