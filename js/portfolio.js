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
        const portfolioItems = document.querySelectorAll('.portfolio-item:not(.active)');
        
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
        
        // Animasi portfolio items dengan staggered delay
        portfolioItems.forEach((item, index) => {
            if (isInViewport(item, 50)) {
                setTimeout(() => {
                    item.classList.add('active');
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

// Data proyek yang dioptimalkan
const projectsData = {
    'deebot': {
        title: 'Deebot Vacuum-Digital Marketing & E-commerce',
        image: 'img/projectdeebot.png',
        description: 'Proyek e-commerce ini saya buat untuk memasarkan produk Deebot Vacuum dengan desain modern, responsif, dan fitur checkout. Saya berperan dalam merancang UI dan memastikan pengalaman pengguna yang nyaman.',
        longDescription: 'Proyek e-commerce Deebot Vacuum ini dirancang dengan fokus pada pengalaman pengguna yang optimal dan konversi penjualan yang tinggi. Website ini menampilkan berbagai model vacuum robot Deebot dengan tampilan yang menarik dan informatif. Setiap halaman produk dilengkapi dengan spesifikasi detail, galeri foto/video, ulasan pengguna, dan perbandingan dengan model lainnya.<br><br>Fitur e-commerce lengkap seperti keranjang belanja, sistem checkout yang aman, dan berbagai metode pembayaran terintegrasi dengan baik. Selain itu, ada halaman khusus untuk promosi, diskon, dan program membership yang meningkatkan retensi pelanggan.',
        tools: 'HTML, CSS, JavaScript, React.js, Node.js',
        duration: '3 bulan',
        role: 'UI/UX Designer, Frontend Developer',
        client: 'PT Ecovacs Indonesia',
    },
    'dashboard': {
        title: 'Pembuatan Dashboard Analitik dengan RStudio dan Shiny',
        image: 'img/dashboard.jpg',
        description: 'Dashboard analitik ini saya buat menggunakan RStudio dan Shiny untuk memvisualisasikan data secara interaktif. Dashboard ini dilengkapi grafik, tabel, dan filter yang memudahkan proses analisis data.',
        longDescription: 'Dashboard analitik ini dikembangkan untuk memvisualisasikan dan menganalisis data penjualan, performa produk, dan perilaku konsumen. Dengan menggunakan R dan framework Shiny, dashboard ini menyajikan data yang kompleks dalam bentuk visual yang mudah dipahami.<br><br>Fitur utama dashboard ini meliputi berbagai jenis visualisasi (grafik garis, bar chart, heatmap, dll), filter data dinamis, laporan yang dapat didownload dalam format PDF/Excel, serta integrasi dengan database untuk pembaruan data secara real-time. Dashboard ini juga dilengkapi dengan panel analisis prediktif yang membantu pengguna memprediksi tren penjualan di masa depan.',
        tools: 'R, RStudio, Shiny, HTML, CSS, SQL',
        duration: '2 bulan',
        role: 'Data Analyst, Full-stack Developer',
        client: 'PT Data Analytics Indonesia',
    },
    'appdesign': {
        title: 'App Design & Prototype',
        image: 'img/figma.png',
        description: 'Saya merancang antarmuka pengguna (UI) untuk aplikasi mobile bertema desain grafis, yang memungkinkan pengguna membuat logo, poster, dan materi visual lainnya dengan mudah.',
        longDescription: 'Proyek desain aplikasi dan prototype ini dibuat untuk sebuah aplikasi mobile yang fokus pada produktivitas dan manajemen waktu. Proses pengembangan dimulai dengan user research yang mendalam untuk memahami kebutuhan dan pain points pengguna.<br><br>Saya mendesain user flow, wireframes, dan high-fidelity mockups menggunakan Figma. Prototype interaktif dibuat untuk mensimulasikan pengalaman pengguna sebenarnya dan dilakukan usability testing dengan beberapa pengguna potensial. Hasil feedback digunakan untuk menyempurnakan desain sebelum masuk tahap pengembangan.',
        tools: 'Figma, Adobe XD, Sketch, InVision',
        duration: '1,5 bulan',
        role: 'UI/UX Designer, Product Designer',
        client: 'PT Mobile App Indonesia',
    }
};

// Fungsi untuk menampilkan modal yang dioptimalkan dengan lazyload gambar
function displayProjectModal(projectKey) {
    const project = projectsData[projectKey];
    if (!project) return;
    
    const modalContainer = document.querySelector('.portfolio-modal');
    
    // Buat galeri gambar jika tersedia
    let galleryHTML = '';
    if (project.gallery && project.gallery.length > 0) {
        galleryHTML = `
            <h3 style="margin: 30px 0 15px; color: #00e5ff;">Gallery</h3>
            <div class="modal-gallery">
                ${project.gallery.map(img => `<img src="${img}" alt="${project.title}" class="gallery-image" loading="lazy" width="200" height="150">`).join('')}
            </div>
        `;
    }
    
    // Isi konten modal
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${project.title}</h2>
                <button class="modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${project.image}" alt="${project.title}" class="modal-image" width="100%" height="auto">
                
                <div class="modal-description">
                    ${project.longDescription}
                </div>
                
                ${galleryHTML}
                
                <div class="modal-details">
                    <div class="detail-item">
                        <h4>Tools/Technologies</h4>
                        <p>${project.tools}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Duration</h4>
                        <p>${project.duration}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Role</h4>
                        <p>${project.role}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Client</h4>
                        <p>${project.client}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-button modal-close-btn">Close</button>
            </div>
        </div>
    `;
    
    // Tampilkan modal
    modalContainer.style.display = 'block';
    
    // Tambahkan event listener untuk tombol close
    const closeButtons = modalContainer.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.style.display = 'none';
        });
    });
    
    // Tutup modal jika user klik di luar konten modal
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });
    
    // Tutup modal dengan tombol ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modalContainer.style.display = 'none';
        }
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

// Setup awal pada DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup page transitions
    setupPageTransitions();
    
    // Setup visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Inisialisasi penuh pada window load
window.addEventListener('load', function() {
    // Hapus overlay
    const overlay = document.querySelector('.page-transition-overlay');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    overlay.classList.remove('active');
    loadingIndicator.classList.remove('active');
    
    // Buat efek hujan dengan delay untuk optimasi performa
    setTimeout(() => {
        createRain();
    }, 100);
    
    // Initial check untuk elemen dalam viewport
    revealOnScroll();
    
    // Tambahkan event listener scroll dengan throttling untuk performa lebih baik
    window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
    
    // Setup event listeners untuk tombol "View more..."
    const viewMoreLinks = document.querySelectorAll('.view-more-link');
    viewMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectKey = this.getAttribute('data-project');
            if (projectKey) {
                displayProjectModal(projectKey);
            }
        });
    });
});