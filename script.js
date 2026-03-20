// Loading Animation
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Testimonials Slider
const testimonialsContainer = document.querySelector('.testimonials-container');
const testimonialCards = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');
let currentIndex = 0;

function updateSlider() {
    testimonialsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Dot click events
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
    });
});

// Auto-slide testimonials
setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    updateSlider();
}, 5000);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollTop = document.querySelector('.scroll-top');
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

// Scroll to top functionality
document.querySelector('.scroll-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Service filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const serviceCards = document.querySelectorAll('.service-card');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const categoryValue = button.getAttribute('data-category');
        
        serviceCards.forEach(card => {
            if (categoryValue === 'all' || card.getAttribute('data-category') === categoryValue) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Booking form submission with FormSubmit
const bookingForm = document.getElementById('bookingForm');
const confirmationModal = document.getElementById('confirmationModal');

// Set minimum date for booking to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').min = today;

// Service booking functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service links functionality
    initializeServiceLinks();
    
    // Update booking form with all services
    updateBookingFormOptions();
});

// Function to initialize service links
function initializeServiceLinks() {
    const serviceSelect = document.getElementById('service');
    const serviceLinks = document.querySelectorAll('.service-link');
    
    // Add click event to all service links
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceValue = this.getAttribute('data-service');
            console.log('Service clicked:', serviceValue);
            
            // Try to find exact match first
            let found = false;
            for (let i = 0; i < serviceSelect.options.length; i++) {
                const option = serviceSelect.options[i];
                
                // Remove price for comparison
                const clickedServiceWithoutPrice = serviceValue.split(' - ₹')[0];
                const optionServiceWithoutPrice = option.text.split(' - ₹')[0];
                
                // Exact match (case insensitive)
                if (optionServiceWithoutPrice.toLowerCase() === clickedServiceWithoutPrice.toLowerCase()) {
                    serviceSelect.value = option.value;
                    found = true;
                    console.log('Exact match found:', option.value);
                    break;
                }
            }
            
            // If exact match not found, try partial match
            if (!found) {
                const clickedServiceName = serviceValue.split(' - ')[0];
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    const option = serviceSelect.options[i];
                    const optionText = option.text.toLowerCase();
                    const clickedText = clickedServiceName.toLowerCase();
                    
                    if (optionText.includes(clickedText) || clickedText.includes(optionText.split(' - ')[0])) {
                        serviceSelect.value = option.value;
                        found = true;
                        console.log('Partial match found:', option.value);
                        break;
                    }
                }
            }
            
            if (found) {
                // Scroll to booking section
                document.getElementById('booking').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the selected option in the form
                highlightService(serviceSelect);
                
                // Show notification
                showServiceSelectedNotification(serviceValue);
                
                // Focus on the service select
                setTimeout(() => {
                    serviceSelect.focus();
                }, 500);
            } else {
                console.log('Service not found in dropdown:', serviceValue);
                // Fallback: set the service manually and show message
                const tempOption = document.createElement('option');
                tempOption.value = serviceValue;
                tempOption.textContent = serviceValue;
                serviceSelect.appendChild(tempOption);
                serviceSelect.value = serviceValue;
                
                // Scroll to booking section
                document.getElementById('booking').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the selected option in the form
                highlightService(serviceSelect);
                
                // Show notification
                showServiceSelectedNotification(serviceValue);
            }
        });
    });
}

// Function to update booking form with all services
function updateBookingFormOptions() {
    const serviceSelect = document.getElementById('service');
    
    // Clear existing options except the first one
    while (serviceSelect.options.length > 1) {
        serviceSelect.remove(1);
    }
    
    // Define all services with their categories
    const allServices = {
        "Hair Cutting & Styling": [
            "U-Cut - ₹180",
            "V-Cut - ₹180",
            "Layer Cut - ₹350",
            "Step Cut - ₹350",
            "Feather Cut - ₹450",
            "One-Length Cut - ₹150",
            "Fringes / Front Cut - ₹100",
            "Kids Haircut - ₹180",
            "Blow Dry - ₹100",
            "Straight Finish - ₹1000",
            "Curls / Waves - ₹1200"
        ],
        "Hair Wash & Care": [
            "Basic Hair Wash - ₹150",
            "Deep Conditioning - ₹200",
            "Anti-Dandruff Wash - ₹350",
            "Clarifying Wash - ₹180",
            "Scalp Massage - ₹500"
        ],
        "Hair Spa & Treatments": [
            "Hydration Spa - ₹700",
            "Smoothening Spa - ₹890",
            "Anti-Dandruff Spa - ₹790",
            "Anti-Hairfall Spa - ₹699",
            "Protein Spa - ₹1200",
            "Keratin Spa - ₹3500",
            "Hair Botox Treatment - ₹3599",
            "Olaplex Treatment - ₹1599"
        ],
        "Korean Spa": [
            "Korean Spa - Basic - ₹1499",
            "Korean Spa - Premium - ₹2499"
        ],
        "Hair Colouring": [
            "Root Touch-Up - ₹600",
            "Global Hair Colour - ₹1500-2500",
            "Highlights - ₹350/strip",
            "Balayage - ₹3599"
        ],
        "Chemical Services": [
            "Permanent Straightening - ₹5000",
            "Smoothening - ₹5000",
            "Keratin Treatment - ₹3500",
            "Rebonding - ₹6000",
            "Perming - ₹3000"
        ],
        "Facials & Clean-Ups": [
            "Clean-Ups - ₹350",
            "Basic Clean-Up - ₹250",
            "De-Tan Clean-Up - ₹500",
            "Fruit Facial - ₹599",
            "Gold Facial - ₹799",
            "Diamond Facial - ₹999",
            "Pearl Facial - ₹1199",
            "Anti-Acne Facial - ₹1299-1599",
            "Anti-Ageing Facial - ₹1499",
            "Hydra Facial - ₹1499-2499",
            "Brightening Facial - ₹1299",
            "Vitamin-C Facial - ₹1000-3000",
            "Luxury Facial - ₹4999"
        ],
        "Bleach": [
            "Face Bleach - ₹200",
            "Neck Bleach - ₹100",
            "Full Hand - ₹250",
            "Full Leg - ₹450",
            "De-Tan Bleach - ₹150"
        ],
        "Threading": [
            "Eyebrows - ₹30",
            "Upper Lip - ₹10",
            "Chin - ₹10",
            "Forehead - ₹10",
            "Full Face - ₹100"
        ],
        "Waxing": [
            "Underarms - ₹100",
            "Half Arms - ₹400",
            "Full Arms - ₹600",
            "Half Legs - ₹700",
            "Full Legs - ₹1000",
            "Full Body - ₹5000",
            "Rica Wax Underarms - ₹150",
            "Rica Wax Full Arms - ₹500",
            "Rica Wax Full Legs - ₹700",
            "Rica Wax Full Body - ₹7000"
        ],
        "Manicure & Pedicure": [
            "Basic Manicure - ₹400",
            "Basic Pedicure - ₹799",
            "Spa Manicure - ₹600",
            "Spa Pedicure - ₹1000"
        ],
        "Makeup": [
            "Party Makeup - ₹1500",
            "Engagement Makeup - ₹5000",
            "Bridal Makeup - ₹9999",
            "Airbrush Makeup - ₹12000",
            "Hairstyling - ₹1000",
            "Saree Draping - ₹300"
        ],
        "Body Massage": [
            "Head Massage - ₹500",
            "Neck & Shoulder Massage - ₹400",
            "Foot Massage - ₹500",
            "Full Body Massage - ₹2000"
        ],
        "Bridal Packages": [
            "Pre-Bridal Advanced - ₹2500-3500",
            "Full Bridal Package - ₹50000"
        ]
    };
    
    // Populate the select with all services
    Object.keys(allServices).forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        
        allServices[category].forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            optgroup.appendChild(option);
        });
        
        serviceSelect.appendChild(optgroup);
    });
    
    console.log('Booking form updated with', Object.keys(allServices).length, 'categories');
}

// Highlight the service select when a service is chosen
function highlightService(selectElement) {
    selectElement.classList.remove('service-highlight');
    void selectElement.offsetWidth; // Trigger reflow
    selectElement.classList.add('service-highlight');
    
    // Remove highlight class after animation
    setTimeout(() => {
        selectElement.classList.remove('service-highlight');
    }, 2000);
}

// Show notification when service is selected
function showServiceSelectedNotification(serviceName) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.service-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'service-notification';
    
    const notificationHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle" style="color: white; font-size: 1.2rem;"></i>
            <span style="color: white; font-weight: bold;">"${serviceName}" selected for booking!</span>
        </div>
    `;
    
    notification.innerHTML = notificationHTML;
    
    // Add styles to notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover);
        z-index: 10000;
        animation: slideInRight 0.3s ease forwards;
        max-width: 350px;
        border-left: 4px solid var(--gold-color);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add CSS for notification animation if not already added
    if (!document.getElementById('notification-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds with fade out animation
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Booking form submission
bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const bookingData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message'),
        timestamp: new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        })
    };
    
    // Validate form
    if (!bookingData.service || bookingData.service === 'Select a Service') {
        alert('Please select a service from the list');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitBtn.disabled = true;
        
        // Submit to FormSubmit.co
        await submitToFormSubmit(bookingData);
        
        // Show success message
        showCustomSuccessMessage(bookingData);
        
        // Reset form
        this.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        showErrorMessage();
        console.error('Booking error:', error);
        
        // Restore button
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Book Appointment';
        submitBtn.disabled = false;
    }
});

// FormSubmit.co integration
async function submitToFormSubmit(bookingData) {
    const formSubmitURL = 'https://formsubmit.co/ajax/celaviespa@gmail.com';
    
    const response = await fetch(formSubmitURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: 'New Appointment Booking - Celavie Beauty',
            _subject: `📅 New Appointment - ${bookingData.name}`,
            _captcha: 'false',
            _template: 'table',
            'Customer Name': bookingData.name,
            'Customer Email': bookingData.email,
            'Customer Phone': bookingData.phone,
            'Service Required': bookingData.service,
            'Preferred Date': bookingData.date,
            'Preferred Time': bookingData.time,
            'Special Requests': bookingData.message || 'None',
            'Booking Time': bookingData.timestamp,
            'Salon': 'Celavie Beauty'
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to send booking');
    }
    
    return response.json();
}

// Custom success message
function showCustomSuccessMessage(bookingData) {
    const modalContent = confirmationModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Appointment Request Received!</h3>
        <div class="booking-summary">
            <p><strong>Thank you, ${bookingData.name}!</strong></p>
            <p>We have received your booking request for:</p>
            <ul>
                <li><strong>Service:</strong> ${bookingData.service}</li>
                <li><strong>Date:</strong> ${formatDate(bookingData.date)}</li>
                <li><strong>Time:</strong> ${bookingData.time}</li>
            </ul>
            <p>We will contact you at <strong>${bookingData.phone}</strong> within 2 hours to confirm your appointment.</p>
        </div>
        <p><small>You will also receive a confirmation email at ${bookingData.email}</small></p>
        <button class="btn" id="modalClose">Close</button>
    `;
    
    // Re-attach event listener to new close button
    const newCloseBtn = modalContent.querySelector('#modalClose');
    newCloseBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
    });
    
    confirmationModal.classList.add('active');
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Error message
function showErrorMessage() {
    const modalContent = confirmationModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-icon" style="color: #ff6b6b;">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Booking Failed</h3>
        <p>There was an error processing your booking. Please try one of these options:</p>
        <div class="alternative-options">
            <p><strong>Call us directly:</strong> <a href="tel:9348277689">9348277689</a></p>
            <p><strong>WhatsApp us:</strong> <a href="https://wa.me/919348277689" target="_blank">Message on WhatsApp</a></p>
            <p><strong>Email us:</strong> <a href="mailto:celaviespa@gmail.com">celaviespa@gmail.com</a></p>
        </div>
        <button class="btn" id="modalClose">Close</button>
    `;
    
    const newCloseBtn = modalContent.querySelector('#modalClose');
    newCloseBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
    });
    
    confirmationModal.classList.add('active');
}

// Close modal when clicking outside
confirmationModal.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        confirmationModal.classList.remove('active');
    }
});

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Simple validation
    if (email && email.includes('@')) {
        // In a real implementation, you would send this to your email service
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    } else {
        alert('Please enter a valid email address.');
    }
});



// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Celavie Beauty website loaded successfully!');
    console.log('Booking system ready - submissions will go to: celaviespa@gmail.com');
    console.log('Service linking functionality activated');
});

// ============================================
// SMART POPUP - RANDOM START AD + AUTO-ROTATION
// ============================================

// Array of ad images - UPDATE THESE WITH YOUR ACTUAL FILENAMES
const adImages = [
    'ad1.jpeg',   // Your first ad
    'ad2.jpeg',              // Your second ad
    'ad3.jpeg'               // Your third ad
];

let currentAdIndex = 0;
let rotationInterval = null;
let autoRotate = true;

// Wait for everything to load
window.addEventListener('load', function() {
    // Get elements
    const imagePopup = document.getElementById('imagePopup');
    const imagePopupClose = document.getElementById('imagePopupClose');
    const popupImage = document.getElementById('popupImage');
    const counterDots = document.querySelectorAll('.counter-dot');
    
    // If elements don't exist, exit
    if (!imagePopup || !imagePopupClose || !popupImage) {
        console.log('Popup elements not found');
        return;
    }
    
    // Track which ads user has seen across sessions
    let seenAds = JSON.parse(localStorage.getItem('seenAds') || '[]');
    
    // If user has seen all ads, reset the tracking
    if (seenAds.length >= adImages.length) {
        seenAds = [];
        console.log('Reset seen ads tracking');
    }
    
    // Find unseen ads
    const unseenAds = adImages.filter(ad => !seenAds.includes(ad));
    
    // Choose random ad from unseen ads (or all if none unseen)
    let startAd;
    if (unseenAds.length > 0) {
        const randomUnseenIndex = Math.floor(Math.random() * unseenAds.length);
        startAd = unseenAds[randomUnseenIndex];
        // Mark this ad as seen
        seenAds.push(startAd);
        localStorage.setItem('seenAds', JSON.stringify(seenAds));
        console.log('Starting with unseen ad:', startAd);
    } else {
        // Fallback - pick random from all ads
        const randomIndex = Math.floor(Math.random() * adImages.length);
        startAd = adImages[randomIndex];
        console.log('Starting with random ad:', startAd);
    }
    
    // Find the index of the starting ad
    currentAdIndex = adImages.indexOf(startAd);
    if (currentAdIndex === -1) currentAdIndex = 0;
    
    // Set initial image
    popupImage.src = startAd;
    
    // Update counter dots
    function updateCounterDots(index) {
        counterDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    updateCounterDots(currentAdIndex);
    
    // Function to change to next ad
    function nextAd() {
        if (!autoRotate) return;
        
        // Move to next ad (cycle through)
        currentAdIndex = (currentAdIndex + 1) % adImages.length;
        const nextAd = adImages[currentAdIndex];
        
        // Fade effect for smooth transition
        popupImage.style.opacity = '0';
        setTimeout(function() {
            popupImage.src = nextAd;
            popupImage.style.opacity = '1';
            updateCounterDots(currentAdIndex);
            console.log('Rotating to ad:', nextAd);
        }, 150);
    }
    
    // Function to go to specific ad
    function goToAd(index) {
        if (!autoRotate) return;
        
        currentAdIndex = index;
        const newAd = adImages[currentAdIndex];
        
        popupImage.style.opacity = '0';
        setTimeout(function() {
            popupImage.src = newAd;
            popupImage.style.opacity = '1';
            updateCounterDots(currentAdIndex);
            console.log('Jumping to ad:', newAd);
        }, 150);
        
        // Reset rotation timer
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = setInterval(nextAd, 2000);
        }
    }
    
    // Show popup after 1.5 seconds
    setTimeout(function() {
        imagePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Start auto-rotation every 4 seconds
        rotationInterval = setInterval(nextAd, 2000);
        
    }, 1500);
    
    // Close popup function (stops rotation)
    function closePopup() {
        autoRotate = false;
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
        imagePopup.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Popup closed');
    }
    
    // Close button click
    imagePopupClose.addEventListener('click', closePopup);
    
    // Close when clicking outside image
    imagePopup.addEventListener('click', function(e) {
        if (e.target === imagePopup) {
            closePopup();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagePopup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Add click functionality to counter dots
    if (counterDots.length > 0) {
        counterDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                if (imagePopup.classList.contains('active')) {
                    goToAd(index);
                }
            });
        });
    }
    
    // Pause rotation on hover
    popupImage.addEventListener('mouseenter', function() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
            console.log('Rotation paused');
        }
    });
    
    // Resume rotation on mouse leave
    popupImage.addEventListener('mouseleave', function() {
        if (imagePopup.classList.contains('active') && autoRotate) {
            rotationInterval = setInterval(nextAd, 2000);
            console.log('Rotation resumed');
        }
    });
    
    console.log('Popup initialized with', adImages.length, 'ads');
});
