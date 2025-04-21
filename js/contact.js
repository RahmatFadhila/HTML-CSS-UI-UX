// Inisialisasi untuk IndexedDB
let db;
const DB_NAME = 'ContactFormDB';
const DB_VERSION = 1;
const STORE_NAME = 'submissions';
const ADMIN_PASSWORD = 'rahmat123'; // Password untuk akses admin

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

// Inisialisasi database IndexedDB
function initDatabase() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = function(event) {
        console.error("Database error: ", event.target.error);
    };
    
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        
        // Create an object store for this database
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            
            // Define the structure of our data
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: false });
            objectStore.createIndex('subject', 'subject', { unique: false });
            objectStore.createIndex('message', 'message', { unique: false });
            objectStore.createIndex('date', 'date', { unique: false });
            
            console.log("Object store created successfully");
        }
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database initialized successfully");
        
        // Tambahkan tombol admin ke footer
        addAdminButtonToFooter();
    };
}

// Simpan data form ke database
function saveToDatabase(formData) {
    if (!db) {
        console.error("Database not initialized");
        return false;
    }
    
    // Start a transaction
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    
    // Add the data to the object store
    const request = objectStore.add(formData);
    
    request.onsuccess = function(event) {
        console.log("Data saved successfully with ID: ", event.target.result);
        return true;
    };
    
    request.onerror = function(event) {
        console.error("Error saving data: ", event.target.error);
        return false;
    };
}

// Tambahkan tombol admin di footer (hanya ikon kunci)
function addAdminButtonToFooter() {
    // Cari elemen footer
    const footerBottom = document.querySelector('.footer-bottom');
    if (!footerBottom) return;
    
    // Buat tombol admin hanya dengan icon kunci
    const adminButton = document.createElement('a');
    adminButton.href = '#';
    adminButton.className = 'admin-link';
    adminButton.innerHTML = '<i class="fas fa-lock"></i>';
    adminButton.title = 'Admin Access';
    
    // Tambahkan style untuk tombol
    const style = document.createElement('style');
    style.textContent = `
        .admin-link {
            color: var(--text-faded);
            font-size: 0.9rem;
            text-decoration: none;
            margin-left: 15px;
            transition: color 0.3s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
        }
        
        .admin-link:hover {
            color: var(--main-color);
        }
        
        .admin-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background-color: var(--card-bg);
            z-index: 1000;
            box-shadow: -5px 0 15px rgba(0,0,0,0.3);
            transition: right 0.4s ease;
            overflow-y: auto;
            padding: 20px;
        }
        
        .admin-panel.active {
            right: 0;
        }
        
        .admin-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-lighter);
        }
        
        .admin-panel-header h2 {
            color: var(--main-color);
            font-size: 1.5rem;
        }
        
        .close-admin {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-admin:hover {
            color: var(--main-color);
        }
        
        .comment-card {
            background-color: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 3px solid var(--main-color);
        }
        
        .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
        
        .comment-name {
            font-weight: bold;
            color: var(--main-color);
        }
        
        .comment-date {
            color: var(--text-lightest);
        }
        
        .comment-subject {
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .comment-message {
            white-space: pre-wrap;
            margin-bottom: 10px;
            font-size: 0.95rem;
        }
        
        .comment-email {
            font-size: 0.85rem;
            color: var(--text-lightest);
        }
        
        .admin-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 999;
            display: none;
        }
        
        .admin-panel-overlay.active {
            display: block;
        }
        
        .delete-comment {
            background-color: rgba(255,70,70,0.2);
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            float: right;
        }
        
        .delete-comment:hover {
            background-color: rgba(255,70,70,0.4);
        }
        
        .no-comments {
            text-align: center;
            padding: 30px 0;
            color: var(--text-lightest);
        }
        
        .password-form {
            background-color: var(--card-bg);
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1001;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }
        
        .password-form h3 {
            color: var(--main-color);
            margin-bottom: 15px;
        }
        
        .password-form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            background-color: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 5px;
            color: var(--text-color);
        }
        
        .password-form input:focus {
            outline: none;
            border-color: var(--main-color);
        }
        
        .password-form button {
            background-color: var(--main-color-light);
            color: var(--text-color);
            border: 1px solid var(--main-color);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .password-form button:hover {
            background-color: var(--main-color);
            color: #161c24;
        }
        
        .password-error {
            color: #ff5555;
            margin-top: 10px;
            font-size: 0.9rem;
            display: none;
        }
        
        .password-error.active {
            display: block;
        }
        
        .password-form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .close-password-form {
            background: none;
            border: none;
            color: var(--text-lightest);
            font-size: 1.2rem;
            cursor: pointer;
            transition: color 0.3s ease;
            padding: 0;
            margin: 0;
        }
        
        .close-password-form:hover {
            color: var(--main-color);
        }
        
        @media (max-width: 500px) {
            .admin-panel {
                width: 90%;
                right: -90%;
            }
            
            .password-form {
                width: 85%;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Tambahkan event listener ke tombol admin
    adminButton.addEventListener('click', function(e) {
        e.preventDefault();
        showPasswordForm();
    });
    
    // Tambahkan tombol ke footer
    footerBottom.appendChild(adminButton);
}

// Tampilkan form password dengan tombol X untuk menutup
function showPasswordForm() {
    // Buat overlay
    const overlay = document.createElement('div');
    overlay.className = 'admin-panel-overlay';
    
    // Buat form password dengan tombol X (close)
    const passwordForm = document.createElement('div');
    passwordForm.className = 'password-form';
    passwordForm.innerHTML = `
        <div class="password-form-header">
            <h3>Admin Login</h3>
            <button class="close-password-form"><i class="fas fa-times"></i></button>
        </div>
        <input type="password" id="admin-password" placeholder="Masukkan password">
        <div class="password-error">Password salah!</div>
        <button id="password-submit">Login</button>
    `;
    
    // Tambahkan ke DOM
    document.body.appendChild(overlay);
    document.body.appendChild(passwordForm);
    
    // Tampilkan overlay
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Focus pada input password
    setTimeout(() => {
        passwordForm.querySelector('#admin-password').focus();
    }, 100);
    
    // Handle tombol tutup (X) pada form password
    passwordForm.querySelector('.close-password-form').addEventListener('click', function() {
        closePasswordForm(passwordForm, overlay);
    });
    
    // Handle enter key pada input password
    passwordForm.querySelector('#admin-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
    
    // Handle tombol submit
    passwordForm.querySelector('#password-submit').addEventListener('click', verifyPassword);
    
    // Handle click pada overlay untuk tutup form
    overlay.addEventListener('click', function() {
        closePasswordForm(passwordForm, overlay);
    });
    
    // Fungsi untuk verifikasi password
    function verifyPassword() {
        const password = passwordForm.querySelector('#admin-password').value;
        
        if (password === ADMIN_PASSWORD) {
            // Password benar, buka panel admin
            closePasswordForm(passwordForm, null);
            showAdminPanel(overlay);
        } else {
            // Password salah, tampilkan error
            passwordForm.querySelector('.password-error').classList.add('active');
            passwordForm.querySelector('#admin-password').value = '';
            passwordForm.querySelector('#admin-password').focus();
        }
    }
}

// Tutup form password
function closePasswordForm(form, overlay) {
    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    setTimeout(() => {
        if (form) form.remove();
        if (overlay) overlay.remove();
    }, 300);
}

// Tampilkan panel admin
function showAdminPanel(overlay) {
    // Buat panel admin
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <div class="admin-panel-header">
            <h2>Pesan Masuk</h2>
            <button class="close-admin"><i class="fas fa-times"></i></button>
        </div>
        <div class="admin-panel-content">
            <div id="comments-container">
                <div class="loading">Memuat pesan...</div>
            </div>
        </div>
    `;
    
    // Tambahkan ke DOM
    document.body.appendChild(adminPanel);
    
    // Tambahkan event listeners
    adminPanel.querySelector('.close-admin').addEventListener('click', function() {
        closeAdminPanel(adminPanel, overlay);
    });
    
    overlay.addEventListener('click', function() {
        closeAdminPanel(adminPanel, overlay);
    });
    
    // Tampilkan panel admin dengan delay untuk animasi
    setTimeout(() => {
        adminPanel.classList.add('active');
    }, 10);
    
    // Load data komentar
    loadComments(adminPanel.querySelector('#comments-container'));
}

// Tutup panel admin
function closeAdminPanel(panel, overlay) {
    panel.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
        panel.remove();
        overlay.remove();
    }, 400);
}

// Muat komentar dari database
function loadComments(container) {
    if (!db) {
        container.innerHTML = '<div class="no-comments">Database tidak tersedia</div>';
        return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();
    
    request.onsuccess = function(event) {
        const comments = event.target.result;
        
        if (comments.length === 0) {
            container.innerHTML = '<div class="no-comments">Belum ada pesan masuk</div>';
            return;
        }
        
        // Sort comments by date, newest first
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let commentsHTML = '';
        
        comments.forEach(comment => {
            // Format date
            const date = new Date(comment.date);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            commentsHTML += `
                <div class="comment-card" data-id="${comment.id}">
                    <div class="comment-header">
                        <span class="comment-name">${comment.name}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                    <div class="comment-subject">${comment.subject}</div>
                    <div class="comment-message">${comment.message}</div>
                    <div class="comment-email">
                        <a href="mailto:${comment.email}">${comment.email}</a>
                        <button class="delete-comment" data-id="${comment.id}">Hapus</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = commentsHTML;
        
        // Add event listeners to delete buttons
        const deleteButtons = container.querySelectorAll('.delete-comment');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.getAttribute('data-id'));
                deleteComment(id, container);
            });
        });
    };
    
    request.onerror = function(event) {
        container.innerHTML = '<div class="no-comments">Error saat memuat data</div>';
    };
}

// Hapus komentar dari database
function deleteComment(id, container) {
    if (!db) return;
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);
    
    request.onsuccess = function(event) {
        // Remove comment from DOM
        const commentCard = container.querySelector(`.comment-card[data-id="${id}"]`);
        if (commentCard) {
            commentCard.style.opacity = '0';
            setTimeout(() => {
                commentCard.remove();
                
                // Check if there are any comments left
                if (container.querySelectorAll('.comment-card').length === 0) {
                    container.innerHTML = '<div class="no-comments">Belum ada pesan masuk</div>';
                }
            }, 300);
        }
    };
}

// Setup dasar pada DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    initDatabase();
    
    // Setup page transitions
    setupPageTransitions();
    
    // Setup visibility event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Form submission handler dengan pesan terima kasih dan database
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah pengiriman form default
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create form data object for database
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                date: new Date().toISOString() // Add submission timestamp
            };
            
            // Save to database
            saveToDatabase(formData);
            
            // Sembunyikan form dengan animasi
            const formElements = this.querySelectorAll('.form-row, .form-group.full-width');
            formElements.forEach(element => {
                element.style.opacity = '0';
            });
            
            setTimeout(() => {
                // Sembunyikan form
                formElements.forEach(element => {
                    element.classList.add('form-hidden');
                });
                
                // Tampilkan pesan terima kasih
                document.getElementById('thankYouMessage').classList.add('active');
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