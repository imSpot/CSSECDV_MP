document.getElementById('search-box').addEventListener('focus', function () {
    document.getElementById('search-dropdown').style.display = 'block';
});

document.getElementById('search-box').addEventListener('blur', function () {
    setTimeout(function () {
        document.getElementById('search-dropdown').style.display = 'none';
    }, 200);
});

function selectSearch(search) {
    document.getElementById('search-box').value = search;
    document.getElementById('search-dropdown').style.display = 'none';
}