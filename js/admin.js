// Set variables with elements
const containerBtns = document.getElementById('container-buttons');
const containerTable = document.getElementById('container-table');
const radioBtnUsers = document.getElementById('radio-button-users');
const radioBtnAdminRoles = document.getElementById('radio-button-admin-roles');
const radioBtnAdmin = document.getElementById('radio-button-admin');
const radioBtnAdminPermissions = document.getElementById('radio-button-admin-permissions');
const radioBtnMovies = document.getElementById('radio-button-movies');
const radioBtnAboutUs = document.getElementById('radio-button-about-us');
const addBtn = document.getElementById('button-add');
const accountSearchBar = document.getElementById('user-search-bar'); //addded for accounts searching
const movieSearchBar = document.getElementById('movie-search-bar'); //added for movie searching
const saveBtn = document.getElementById('button-save');
const clearBtn = document.getElementById('button-clear');

let rowCtr = -1;

/**
 * Handles the onclick event for the 'Users' radio button.
 * Fetches data from the 'users' table, creates a table, and sets the onclick event for the 'Add' button.
 * @async
 * @returns {void}
 */
radioBtnUsers.onclick = async () => {
    rowCtr = 0;
    const data = await $.get('/getRows', { table:'users' });
    const keys = Object.keys(data[0]);

    createTable(data, keys, 'users');

    addBtn.style.visibility = 'visible';
    accountSearchBar.style.visibility = 'visible';


    addBtn.onclick = () => {
        window.location.href = '/add-account';
    };

    movieSearchBar.style.visibility = 'hidden';
    saveBtn.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
};

/**
 * Handles the oninput event for the search bar.
 * Fetches data from the 'users' table based on search query and creates a table.
 * @async
 * @returns {void}
 */
accountSearchBar.oninput = async () => {
    const query = accountSearchBar.value.trim();
    if (query) {
        const data = await $.get('/searchUser', { query });
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            createTable(data, keys, 'users');
        } else {
            containerTable.innerHTML = 'No results found';
        }
    } else {
        const data = await $.get('/getRows', { table: 'users' });
        const keys = Object.keys(data[0]);
        createTable(data, keys, 'users');
    }
};

/**
 * Handles the oninput event for the search bar.
 * Fetches data from the 'movies' table based on search query and creates a table.
 * @async
 * @returns {void}
 */
movieSearchBar.oninput = async () => {
    const query = movieSearchBar.value.trim();
    if (query) {
        const data = await $.get('/searchFilm', { query });
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            createTable(data, keys, 'movies');
        } else {
            containerTable.innerHTML = 'No results found';
        }
    } else {
        const data = await $.get('/getRows', { table: 'movies' });
        const keys = Object.keys(data[0]);
        createTable(data, keys, 'movies');
    }
};

/**
 * Handles the onclick event for the 'Admin Roles' radio button.
 * Fetches data from the 'adminRoles' table, creates a table, and sets the onclick event for the 'Add' button.
 * @async
 * @returns {void}
 */
radioBtnAdminRoles.onclick = async () => {
    addBtn.style.visibility = 'hidden';
    rowCtr = 0;
    
    const data = await $.get('/getRows', { table:'adminRoles' });
    const keys = Object.keys(data[0]);

    createTable(data, keys, 'adminRoles');

    //Hide search bar for Accounts
    accountSearchBar.style.visibility = 'hidden';
    movieSearchBar.style.visibility = 'hidden';
    saveBtn.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
};

/**
 * Handles the onclick event for the 'Admin' radio button.
 * Fetches data from the 'admin' table, creates a table, and sets the onclick event for the 'Add' button.
 * @async
 * @returns {void}
 */
radioBtnAdmin.onclick = async () => {
    addBtn.style.visibility = 'hidden';
    rowCtr = 0;

    const data = await $.get('/getRows', { table:'admin' });
    const keys = Object.keys(data[0]);

    createTable(data, keys, 'admin');

    //Hide search bar for Accounts
    accountSearchBar.style.visibility = 'hidden';
    movieSearchBar.style.visibility = 'hidden';
    saveBtn.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
};

/**
 * Handles the onclick event for the 'Admin Permissions' radio button.
 * Fetches data from the 'adminPermissions' table, creates a table, and sets the onclick event for the 'Add' button.
 * @async
 * @returns {void}
 */
radioBtnAdminPermissions.onclick = async () => {
    addBtn.style.visibility = 'hidden';
    rowCtr = 0;
    
    const data = await $.get('/getRows', { table:'adminPermissions' });
    const keys = Object.keys(data[0]);

    createTable(data, keys, 'adminPermissions');

    //Hide search bar for Accounts
    accountSearchBar.style.visibility = 'hidden';
    movieSearchBar.style.visibility = 'hidden';
    saveBtn.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
};

/**
 * Handles the onclick event for the 'Movies' radio button.
 * Fetches data from the 'movies' table, creates a table, and sets the onclick event for the 'Add' button.
 * @async
 * @returns {void}
 */
radioBtnMovies.onclick = async () => {
    rowCtr = 0;
    const data = await $.get('/getRows', { table:'movies' });
    const keys = Object.keys(data[0]);

    createTable(data, keys, 'movies');
    addBtn.style.visibility = 'visible';
    addBtn.onclick = () => {
        window.location.href = '/add-movie';
    };

    //Hide search bar for Accounts
    accountSearchBar.style.visibility = 'hidden';
    movieSearchBar.style.visibility = 'visible';
    saveBtn.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
};

radioBtnAboutUs.onclick = async () => {
    saveBtn.style.visibility = 'visible';
    clearBtn.style.visibility = 'visible';
    accountSearchBar.style.visibility = 'hidden';
    movieSearchBar.style.visibility = 'hidden';
    addBtn.style.visibility = 'hidden';
    containerTable.innerHTML = '';
    

    await $.get('/get-about-us', async (res) => {
        textArea = await document.createElement('textarea');
        textArea.id = 'user-input';
        textArea.value = res.text;
        containerTable.appendChild(textArea);

        saveBtn.addEventListener('click', () => {
            const userInput = document.getElementById('user-input').value;

            fetch('/save-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: userInput })
            })
            .then(response => response.json())
            .then(data => console.log('Text saved successfully!'))
            .catch(error => console.error('Error saving text:', error));
        });
        
        clearBtn.addEventListener('click', () => {
            textArea.value = '';
        });
    })
}

function createTable(data, keys, table) {
    containerTable.innerHTML = '<table style="border: 1px solid black;"></table>';
    // Creates header for the table
    const header = document.createElement('tr');
    header.id = `row${rowCtr}`;
    keys.forEach((key) => {
        header.innerHTML += `<th>${key}</th>`; 
    })

    if(table != 'admin' && table != 'adminRoles' && table != 'adminPermissions') {    
        header.innerHTML += `<th colspan='2'>Buttons</th>`; 
    }

    containerTable.appendChild(header);
    rowCtr++;
    
    
    // Creates rows for the data
    data.forEach((row) => {
        const newRow = document.createElement('tr');
        const rowNum = rowCtr;
        let data = [];
        let cellCtr = 0;

        newRow.id = `row${rowNum}`;
        newRow.class = 'rows-data';
        
        keys.forEach((key) => {
            const cell = document.createElement('td');
            cell.id = `row${rowNum}cell${cellCtr}`
            cell.innerHTML += `${row[key]}`;

            newRow.appendChild(cell);
            
            cellCtr++;
        });

        if(table != 'admin' && table != 'adminPermissions' && table != 'adminRoles') {
            const newCell = document.createElement('td');
            const editBtn = document.createElement('button');
            const deleteBtn = document.createElement('button');
            
            editBtn.id = `row${rowNum}edit`;
            deleteBtn.id = `row${rowNum}delete`;
            editBtn.innerText = 'Edit';
            deleteBtn.innerText = 'Delete';

            newCell.appendChild(editBtn);
            newCell.appendChild(deleteBtn);
            newRow.appendChild(newCell);
                
            editBtn.onclick = () => {
                const userId = row.id; 
                const movieId = row.id;
                if(table == 'users') {
                    window.location.href = `/edit-account/${userId}`;
                } else if(table == 'movies') {
                    window.location.href = `/edit-movie/${movieId}`;
                }
            }
            
            if(table === 'users') {
                deleteBtn.onclick = async () => {
                    if (confirm("Are you sure?")) {
                        const userId = row.id; 
                        try {
                            const response = await $.post(`/delete-account/${userId}`);
                            if (response.message === 'User deleted successfully') {
                                alert(response.message)
                                
                                const res = await $.get('/get-session-userid');

                                if(res == row.id) {
                                    window.location.href = '/logout';
                                }
                                
                                document.getElementById(`row${rowNum}`).remove();
                            } else {
                                alert('Error deleting user');
                            }
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            alert('Error deleting user');
                        }
                    }
                }
            }   
            if (table === 'movies') {
                deleteBtn.onclick = async () => {
                    if (confirm("Are you sure?")) {
                        const movieId = row.id;
                        try {
                            const response = await fetch(`/delete-movie/${movieId}`, {
                                method: 'POST'
                            });
                            const data = await response.json();
                            if (response.ok) {
                                if (data.message === 'Movie deleted successfully') {
                                    document.getElementById(`row${rowNum}`).remove();
                                } else {
                                    alert('Error deleting movie: ' + data.message);
                                }
                            } else {
                                alert('Error deleting movie: ' + data.message);
                            }
                        } catch (error) {
                            console.error('Error deleting movie:', error);
                            alert('Error deleting movie');
                        }
                    }
                };
            }       
        }

        containerTable.appendChild(newRow);
        
        rowCtr++;
    });
}