// Admin Authentication System
document.addEventListener('DOMContentLoaded', function() {
    initAdminAuth();
});

function initAdminAuth() {
    // Check if already logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken && isValidAdminToken(adminToken)) {
        redirectToAdmin();
        return;
    }

    setupLoginForm();
}

function setupLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            await authenticateAdmin(email, password);
        } catch (error) {
            showNotification('Login failed: ' + error.message, 'error');
        }
    });
}

async function authenticateAdmin(email, password) {
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    try {
        // In a real application, you would verify against your admin_users table
        // For demo purposes, we'll use a simple check
        const validAdmins = [
            { email: 'admin@900music.com', password: 'admin123' },
            { email: 'manager@900music.com', password: 'manager123' }
        ];

        const admin = validAdmins.find(a => a.email === email && a.password === password);
        
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        // Generate a simple admin token (in production, use proper JWT)
        const adminToken = generateAdminToken(email);
        
        // Store admin session
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        showNotification('Login successful!', 'success');
        
        // Redirect to admin panel
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        
    } catch (error) {
        throw error;
    } finally {
        // Reset button state
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

function generateAdminToken(email) {
    // Simple token generation (use proper JWT in production)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${email}:${timestamp}:${random}`);
}

function isValidAdminToken(token) {
    try {
        const decoded = atob(token);
        const parts = decoded.split(':');
        
        if (parts.length !== 3) return false;
        
        const [, timestamp, ] = parts;
        const tokenAge = Date.now() - parseInt(timestamp);
        
        // Token expires after 24 hours
        return tokenAge < 24 * 60 * 60 * 1000;
    } catch (error) {
        return false;
    }
}

function redirectToAdmin() {
    window.location.href = 'admin.html';
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Export for use in other files
window.AdminAuth = {
    isValidAdminToken,
    generateAdminToken,
    getAdminToken: () => localStorage.getItem('adminToken'),
    getAdminEmail: () => localStorage.getItem('adminEmail'),
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
        window.location.href = 'admin-auth.html';
    }
}; 