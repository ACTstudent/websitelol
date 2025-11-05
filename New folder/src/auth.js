// Authentication System
let currentUser = null;

function initAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function login(email, password) {
    if (email && password) {
        currentUser = {
            id: 1,
            name: email.split('@')[0],
            email: email,
            phone: '+1 234 567 8900',
            address: '123 Main St, New York, NY 10001'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        return true;
    }
    return false;
}

function signup(name, email, password) {
    if (name && email && password) {
        currentUser = {
            id: 1,
            name: name,
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    navigateTo('home');
}

function updateProfile(data) {
    if (currentUser) {
        currentUser = { ...currentUser, ...data };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const mobileAuth = document.getElementById('mobile-auth');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    const userName = document.getElementById('user-name');

    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        mobileAuth.style.display = 'none';
        mobileUserMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        mobileAuth.style.display = 'flex';
        mobileUserMenu.style.display = 'none';
    }
}

// Initialize auth on page load
initAuth();
