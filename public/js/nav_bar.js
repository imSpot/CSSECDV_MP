document.addEventListener('DOMContentLoaded', () => {
    $.get('/get-session-isadmin', async (req) => {
        if(!req) {
            await document.getElementById('admin').remove();
        }
    });
});