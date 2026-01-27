// Status configurations
const statusConfig = {
    'booking-submitted': {
        title: 'Booking Submitted!',
        message: 'Your request has been sent successfully',
        duration: 3000
    },
    'quote-generated': {
        title: 'Quote Ready!',
        message: 'Your custom quote has been generated',
        duration: 3000
    },
    'quote-accepted': {
        title: 'Deal Accepted!',
        message: 'Quote accepted. Please proceed with deposit',
        duration: 3000
    },
    'payment-success': {
        title: 'Payment Received!',
        message: 'Deposit payment successful',
        duration: 4000
    },
    'crew-assigned': {
        title: 'Crew Assigned!',
        message: 'Your job has been assigned to our team',
        duration: 3000
    },
    'job-started': {
        title: 'Work Started!',
        message: 'Our crew has begun working on your job',
        duration: 3000
    },
    'job-completed': {
        title: 'Job Completed!',
        message: 'Work finished successfully. Awaiting verification',
        duration: 4000
    },
    'final-payment': {
        title: 'Payment Complete!',
        message: 'All payments received. Invoice generated',
        duration: 4000
    },
    'booking-cancelled': {
        title: 'Booking Cancelled',
        message: 'Your booking has been cancelled',
        duration: 3000
    },
    'no-refund-warning': {
        title: 'No Refund Available',
        message: 'Deposit amount cannot be refunded',
        duration: 4000
    }
};

// Show status popup
function showStatus(statusType) {
    const popup = document.getElementById('statusPopup');
    const config = statusConfig[statusType];
    
    if (!config) return;
    
    // Update content
    popup.querySelector('.status-title').textContent = config.title;
    popup.querySelector('.status-message').textContent = config.message;
    
    // Remove existing status classes
    popup.className = 'popup-container';
    
    // Add new status class
    popup.classList.add(statusType);
    
    // Show popup
    popup.classList.remove('hidden');
    
    // Auto hide after duration
    setTimeout(() => {
        hideStatus();
    }, config.duration);
    
    // Add sound effect (optional)
    playStatusSound(statusType);
}

// Hide status popup
function hideStatus() {
    const popup = document.getElementById('statusPopup');
    popup.classList.add('hidden');
    
    // Clean up classes after animation
    setTimeout(() => {
        popup.className = 'popup-container hidden';
    }, 300);
}

// Play sound effects (optional)
function playStatusSound(statusType) {
    // You can add audio files for each status
    const soundMap = {
        'booking-submitted': 'success.mp3',
        'quote-generated': 'notification.mp3',
        'quote-accepted': 'success.mp3',
        'payment-success': 'payment.mp3',
        'crew-assigned': 'notification.mp3',
        'job-started': 'work.mp3',
        'job-completed': 'complete.mp3',
        'final-payment': 'celebration.mp3',
        'booking-cancelled': 'error.mp3',
        'no-refund-warning': 'warning.mp3'
    };
    
    // Uncomment to enable sounds
    // const audio = new Audio(`sounds/${soundMap[statusType]}`);
    // audio.play().catch(e => console.log('Sound not available'));
}

// API integration functions
class BookingStatusManager {
    constructor() {
        this.currentStatus = null;
        this.statusHistory = [];
    }
    
    // Update booking status
    updateStatus(bookingId, newStatus, data = {}) {
        this.currentStatus = newStatus;
        this.statusHistory.push({
            status: newStatus,
            timestamp: new Date(),
            data: data
        });
        
        // Show animation
        showStatus(newStatus);
        
        // Send to backend
        this.sendStatusUpdate(bookingId, newStatus, data);
    }
    
    // Send status update to backend
    async sendStatusUpdate(bookingId, status, data) {
        try {
            const response = await fetch('/api/booking/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    status: status,
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    
    // Get current status
    getCurrentStatus() {
        return this.currentStatus;
    }
    
    // Get status history
    getStatusHistory() {
        return this.statusHistory;
    }
}

// Initialize status manager
const statusManager = new BookingStatusManager();

// Example usage functions
function simulateBookingFlow() {
    const bookingId = 'BK001';
    let step = 0;
    
    const steps = [
        'booking-submitted',
        'quote-generated',
        'quote-accepted',
        'payment-success',
        'crew-assigned',
        'job-started',
        'job-completed',
        'final-payment'
    ];
    
    const interval = setInterval(() => {
        if (step < steps.length) {
            statusManager.updateStatus(bookingId, steps[step]);
            step++;
        } else {
            clearInterval(interval);
        }
    }, 5000);
}

// Real-time status updates via WebSocket (optional)
function initWebSocketConnection() {
    const ws = new WebSocket('ws://localhost:8080/booking-status');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        showStatus(data.status);
    };
    
    ws.onerror = function(error) {
        console.log('WebSocket error:', error);
    };
}

// Close popup on click outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('statusPopup');
    if (event.target === popup) {
        hideStatus();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideStatus();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showStatus,
        hideStatus,
        BookingStatusManager,
        statusManager
    };
}