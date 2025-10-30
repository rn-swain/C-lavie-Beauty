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
});