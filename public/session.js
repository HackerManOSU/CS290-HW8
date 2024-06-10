document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.cookie.split(';').find(row => row.startsWith('username='));
    if (userInfo) {
        const username = userInfo.split('=')[1];
        document.getElementById('login').textContent = 'Logout';
        document.getElementById('welcome').textContent = `Welcome, ${username}`;
    }
});
