// Detect performance but preserve visual appearance
function detectPerformance() {
    // Detect low-end device
    const isLowEndDevice = () => {
        const processors = navigator.hardwareConcurrency || 1;
        const limitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        return processors <= 2 || limitedMemory;
    };
    
    // Detect slow connection
    const isSlowConnection = () => {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.saveData);
        }
        return false;
    };
    
    // Apply low-performance class only for extreme cases
    const lowPerformance = isLowEndDevice() && isSlowConnection();
    if (lowPerformance) {
        document.body.classList.add('low-performance');
    }
    
    // Keep rain drops count the same to preserve visual appearance
    return {
        rainDrops: isLowEndDevice() ? 20 : 40, // Using original values
        profileRainDrops: isLowEndDevice() ? 8 : 15 // Using original values
    };
}

// Function to hide entrance animation - preserving original timing
function hideEntranceAnimation() {
    const entranceAnimation = document.getElementById('entranceAnimation');
    if (!entranceAnimation) return;
    
    entranceAnimation.style.opacity = '0';
    
    setTimeout(() => {
        entranceAnimation.style.display = 'none';
        sessionStorage.setItem('entranceSeen', 'true');
    }, 500);
}

// Function to animate page elements
function animatePageElements() {
    const elements = document.querySelectorAll('.page-element');
    elements.forEach(element => {
        element.classList.add('visible');
    });
}

// Optimized rain drop creation that preserves visual look
function createRainDrop(isMainRain) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // Random position
    const posX = Math.floor(Math.random() * window.innerWidth);
    drop.style.left = posX + 'px';
    
    // Random falling speed - preserving original randomization
    const fallDuration = isMainRain ? 
        (0.8 + Math.random() * 0.7) : 
        (0.5 + Math.random() * 0.5);
    drop.style.animationDuration = fallDuration + 's';
    
    // Random opacity - preserving original randomization
    const opacity = isMainRain ? 
        (0.2 + Math.random() * 0.4) : 
        (0.1 + Math.random() * 0.3);
    drop.style.opacity = opacity;
    
    // Random size - preserving original randomization
    const size = isMainRain ? 
        (1 + Math.random()) : 
        (0.5 + Math.random() * 0.5);
    drop.style.width = size + 'px';
    drop.style.height = isMainRain ? (size * 15) + 'px' : (size * 10) + 'px';
    
    // Preserve original angled animation
    if (Math.random() > 0.7) {
        drop.style.animation = `rain-fall-angled ${fallDuration}s linear infinite`;
    }
    
    return drop;
}

// Function to create rain effect - optimized but preserving appearance
function createRain() {
    const rainContainer = document.querySelector('.rain-container');
    const rainFooter = document.querySelector('.rain-footer');
    if (!rainContainer || !rainFooter) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.rainDrops;
    
    // Clear any existing drops
    rainContainer.innerHTML = '';
    rainFooter.innerHTML = '';
    
    // Use fragments for better performance
    const mainFragment = document.createDocumentFragment();
    const footerFragment = document.createDocumentFragment();
    
    // Create main rain drops
    for (let i = 0; i < numberOfDrops; i++) {
        mainFragment.appendChild(createRainDrop(true));
    }
    
    // Create footer rain drops
    for (let i = 0; i < numberOfDrops / 2; i++) {
        footerFragment.appendChild(createRainDrop(false));
    }
    
    // Append in one operation for better performance
    rainContainer.appendChild(mainFragment);
    rainFooter.appendChild(footerFragment);
}

// Function to create profile rain - preserving visual appearance
function createProfileRain() {
    const profileRain = document.querySelector('.profile-rain');
    if (!profileRain) return;
    
    const performanceSettings = detectPerformance();
    const numberOfDrops = performanceSettings.profileRainDrops;
    
    // Clear existing drops
    profileRain.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.className = 'profile-rain-drop';
        
        // Preserve original positioning
        const posX = Math.floor(Math.random() * 100);
        drop.style.left = posX + '%';
        
        // Preserve original animation speed
        const fallDuration = 0.8 + Math.random();
        drop.style.animationDuration = fallDuration + 's';
        
        // Preserve original size
        const size = 1 + Math.random();
        drop.style.width = size + 'px';
        drop.style.height = (size * 6) + 'px';
        
        fragment.appendChild(drop);
    }
    
    profileRain.appendChild(fragment);
}

// Lightning effect - preserving original visuals
function createLightning() {
    const lightningContainer = document.querySelector('.lightning-container');
    if (!lightningContainer) return;
    
    // Function to add lightning effect
    const addLightning = () => {
        // Skip if low performance mode
        if (document.body.classList.contains('low-performance')) {
            return;
        }
        
        // Only create lightning sometimes, as in original
        if (Math.random() > 0.7) {
            const lightning = document.createElement('div');
            lightning.className = 'lightning';
            
            // Preserve original positioning
            const posX = Math.floor(Math.random() * 100);
            const posY = Math.floor(Math.random() * 100);
            lightning.style.left = posX + '%';
            lightning.style.top = posY + '%';
            
            lightningContainer.appendChild(lightning);
            
            // Remove lightning after animation finishes
            setTimeout(() => {
                if (lightning.parentNode === lightningContainer) {
                    lightningContainer.removeChild(lightning);
                }
            }, 200);
        }
    };
    
    // Keep original timing interval
    const interval = setInterval(() => {
        // Only add lightning if page is visible
        if (document.visibilityState === 'visible') {
            addLightning();
        }
    }, 5000);
    
    // Store interval reference
    window.lightningInterval = interval;
}

// Page transitions - preserving original behavior
function setupPageTransitions() {
    const transitionLinks = document.querySelectorAll('a[data-transition="true"]');
    const overlay = document.querySelector('.page-transition-overlay');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            overlay.classList.add('active');
            
            // Navigate after animation
            setTimeout(() => {
                sessionStorage.setItem('internalNavigation', 'true');
                window.location.href = target;
            }, 300);
        });
    });
}

// Scroll optimization that won't affect appearance
function optimizeOnScroll() {
    let scrollThrottleTimeout;
    
    window.addEventListener('scroll', () => {
        // Skip if already in throttle
        if (scrollThrottleTimeout) return;
        
        scrollThrottleTimeout = setTimeout(() => {
            // Add reduced class during scroll
            document.body.classList.add('reduced');
            
            // Remove class after scroll ends
            clearTimeout(window.scrollEndTimeout);
            window.scrollEndTimeout = setTimeout(() => {
                document.body.classList.remove('reduced');
                scrollThrottleTimeout = null;
            }, 300);
            
        }, 100);
    }, { passive: true });
}

// Visibility API handler to save resources when tab not visible
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Pause animations when page not visible
        document.body.classList.add('animation-paused');
    } else {
        // Resume animations when page visible again
        document.body.classList.remove('animation-paused');
    }
}

// DOMContentLoaded - initial setup
document.addEventListener('DOMContentLoaded', function() {
    // Setup page transitions
    setupPageTransitions();
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Load event - main initialization
window.addEventListener('load', function() {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    const entranceAnimation = document.getElementById('entranceAnimation');
    const entranceSeen = sessionStorage.getItem('entranceSeen');
    const internalNavigation = sessionStorage.getItem('internalNavigation');
    
    // Optimize for scroll
    optimizeOnScroll();
    
    // Initialize based on navigation state
    if (internalNavigation) {
        // Internal navigation - skip entrance
        sessionStorage.removeItem('internalNavigation');
        
        if (entranceAnimation) {
            entranceAnimation.style.display = 'none';
        }
        
        // Animate page elements
        animatePageElements();
        
        // Create effects with slight delay
        setTimeout(() => {
            createRain();
            createProfileRain();
            createLightning();
        }, 300);
    } else {
        if (entranceSeen) {
            // Returning visitor - skip entrance
            if (entranceAnimation) {
                entranceAnimation.style.display = 'none';
            }
            
            // Animate page elements
            animatePageElements();
            
            // Create effects with slight delay
            setTimeout(() => {
                createRain();
                createProfileRain();
                createLightning();
            }, 300);
        } else {
            // First visit - show entrance
            // Hide entrance after a short time - preserve original timing
            setTimeout(() => {
                hideEntranceAnimation();
                
                // Animate page elements
                animatePageElements();
                
                // Create effects with slight delay
                setTimeout(() => {
                    createRain();
                    createProfileRain();
                    createLightning();
                }, 300);
            }, 1500);
        }
    }
});