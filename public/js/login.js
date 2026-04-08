const form = document.getElementById('loginForm');
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add loading animation to button
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>جاري التسجيل...</span>';
    submitBtn.disabled = true;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Add input animation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.transform = 'scale(0.98)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 200);
    });
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('✓ تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
            
            // Success animation on button
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showNotification(data.error || '✗ حدث خطأ في تسجيل الدخول', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Shake animation on error
            const form = document.querySelector('.glass-card');
            form.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    } catch (error) {
        showNotification('✗ حدث خطأ في الاتصال بالخادم', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Animate inputs on focus
const inputs = document.querySelectorAll('.input-group input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateX(5px)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateX(0)';
    });
});

// Check if already logged in
fetch('/api/check-session')
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            window.location.href = '/dashboard.html';
        }
    });

// Add floating animation to logo
const logo = document.querySelector('.logo-icon');
setInterval(() => {
    logo.style.animation = 'none';
    setTimeout(() => {
        logo.style.animation = 'float 3s ease-in-out infinite';
    }, 10);
}, 3000);