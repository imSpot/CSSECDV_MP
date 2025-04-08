// TO DO: Make a function that would get the div (id="content") from admin that would set the HTML of it to the created HTML 
// TO DO: Make html for each action and table selected

// Set variables with elements
const adminOptions = document.getElementById('admin-options');
const content = document.getElementById('content');
const radioButtonView = document.getElementById('radio-button-view');
const radioButtonAdd = document.getElementById('radio-button-add');
const radioButtonEdit = document.getElementById('radio-button-edit');
const radioButtonDelete = document.getElementById('radio-button-delete');

// Set onclick of radio buttons with their respective functions
radioButtonView.onclick = () => { initializeRightPanel(1) };
radioButtonAdd.onclick = () => { initializeRightPanel(0) };
radioButtonEdit.onclick = () => { initializeRightPanel(1) };
radioButtonDelete.onclick = () => { initializeRightPanel(1) };

adminOptions.innerHTML =`
<select id="drop-down">
    <option value="none">Select A Table</option>
    <option value="users">Users</option>
    <option value="admin">Admin</option>
    <option value="adminRoles">Admin Roles</option>
    <option value="adminPermissions">Admin Permissions</option>
    <option value="movies">Movies</option>
</select>
<input type="search" id="search-bar" placeholder="Search..."></input>
`;

const dropDown = document.getElementById('drop-down');
const searchBar = document.getElementById('search-bar');

dropDown.style.display = 'none';
searchBar.style.display = 'none';

dropDown.addEventListener('change', function() {
    const selectedTable = dropDown.value;

    switch(selectedTable) {
        case 'none':
            if(radioButtonAdd.checked) {
                initializeRightPanel(0);
            } else {
                initializeRightPanel(1);
            }
            break;
        case 'users':
            if(radioButtonView.checked) {
                content.innerHTML = ``;
            } else if(radioButtonAdd.checked) {
                content.innerHTML = ``;
            } else if(radioButtonEdit.checked) {
                content.innerHTML = ``;
            } else if(radioButtonDelete.checked) {
                content.innerHTML = ``;
            }
            break;
        case 'admin':
            if(radioButtonView.checked) {
                content.innerHTML = ``;
            } else if(radioButtonAdd.checked) {
                content.innerHTML = ``;
            } else if(radioButtonEdit.checked) {
                content.innerHTML = ``;
            } else if(radioButtonDelete.checked) {
                content.innerHTML = ``;
            }
            break;
        case 'adminRoles':
            if(radioButtonView.checked) {
                content.innerHTML = ``;
            } else if(radioButtonAdd.checked) {
                content.innerHTML = ``;
            } else if(radioButtonEdit.checked) {
                content.innerHTML = ``;
            } else if(radioButtonDelete.checked) {
                content.innerHTML = ``;
            }
            break;
        case 'adminPermissions':
            if(radioButtonView.checked) {
                content.innerHTML = ``;
            } else if(radioButtonAdd.checked) {
                content.innerHTML = ``;
            } else if(radioButtonEdit.checked) {
                content.innerHTML = ``;
            } else if(radioButtonDelete.checked) {
                content.innerHTML = ``;
            }
            break;
        case 'movies':
            if(radioButtonView.checked) {
                content.innerHTML = ``;
            } else if(radioButtonAdd.checked) {
                content.innerHTML = ``;
            } else if(radioButtonEdit.checked) {
                content.innerHTML = ``;
            } else if(radioButtonDelete.checked) {
                content.innerHTML = ``;
            }
            break;
    }
});

function initializeRightPanel(withSearch) {
    dropDown.style.display = 'block';

    if(withSearch) {
        searchBar.style.display = 'block';
    } else {
        searchBar.style.display = 'none';
    }

    content.innerHTML = '';
}