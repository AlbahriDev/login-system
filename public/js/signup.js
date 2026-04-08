const form = document.getElementById('signupForm');
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('كلمة المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('تم إنشاء الحساب بنجاح! جاري التحويل إلى تسجيل الدخول...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showNotification(data.error || 'حدث خطأ في إنشاء الحساب', 'error');
        }
    } catch (error) {
        showNotification('حدث خطأ في الاتصال بالخادم', 'error');
    }
});

// Check if already logged in
fetch('/api/check-session')
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            window.location.href = '/dashboard.html';
        }
    });