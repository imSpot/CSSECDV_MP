document.addEventListener('DOMContentLoaded', () => {
    const accountMenuBtn = document.getElementById('account-menu-btn');

    $.get('/get-session-isadmin', async (req) => {
        if(!req) {
            await document.getElementById('admin').remove();
        }
    });

    accountMenuBtn.addEventListener("click", () => {
        const menu = document.getElementById('menu');
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', function(event) {
        const menu = document.getElementById('menu');
        const text = document.getElementById('account-menu-btn');
        if (!menu.contains(event.target) && !text.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});