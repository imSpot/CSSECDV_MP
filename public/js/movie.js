const express = require('express');
const multer = require('multer');
const path = require('path');
const {pool, database} = require('../../database.js'); // Adjust the path as needed

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        const sanitizedTitle = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + path.extname(file.originalname);
        cb(null, sanitizedTitle);
    }
});

const upload = multer({ storage });

/**
 * Renders the 'add-movie' view.
 *
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 */
router.get('/add-movie', (req, res) => {
    if(req.session.isAdmin) {
        res.render('add-movie');
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
})
/**
 * Renders the 'view-movie' view.
 *
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 */
router.get('/view-movie', (req, res) => {
    res.render('view-movie');
})

/**
 * Renders the 'edit-movie' view.
 *
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 */
router.get('/edit-movie', (req, res) => {
    if(req.session.isAdmin) {
        res.render('edit-movie');
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
})


/**
 * Handles the search functionality for movies.
 *
 * @param {object} req - The request object containing information about the movie requested.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 */

// router.get('/movies-search', async (req, res) => {
//     const title = req.query.title || '';
//     let queryType = 'All Movies';

//     try {
//         let movies;

//         // Check if the title starts with specific prefixes
//         if (title.toLowerCase().startsWith('categories:')) {
//             const category = title.substring(11).trim().toLowerCase();
//             console.log('Searching for movies with category:', category);
//             queryType = `Movies with category: ${category}`;
//             movies = await database.getMovies(); // Fetch all movies to filter by category
//             movies = movies.filter(movie =>
//                 movie.category.toLowerCase().includes(category)
//             );
//         } else if (title.toLowerCase().startsWith('director:')) {
//             const director = title.substring(9).trim().toLowerCase();
//             console.log('Searching for movies with director:', director);
//             queryType = `Movies with director: ${director}`;
//             movies = await database.getMovies(); // Fetch all movies to filter by director
//             movies = movies.filter(movie =>
//                 movie.directors.toLowerCase().includes(director)
//             );
//         } else if (title.toLowerCase().startsWith('casts:')) {
//             const cast = title.substring(6).trim().toLowerCase();
//             console.log('Searching for movies with cast:', cast);
//             queryType = `Movies with cast: ${cast}`;
//             movies = await database.getMovies(); // Fetch all movies to filter by cast
//             movies = movies.filter(movie =>
//                 movie.casts.toLowerCase().includes(cast)
//             );
//         } else if (title) {
//             console.log('Searching for movies with title:', title);
//             queryType = `Movies with title: ${title}`;
//             movies = await database.searchMovies(title);
//         } else {
//             console.log('Fetching all movies...');
//             movies = await database.getMovies();
//         }

//         const processedMovies = movies.map(movie => ({
//             ...movie,
//             categories: movie.category.split(',').map(cat => cat.trim())
//         }));

//         console.log('Movies found:', movies.length);
//         res.render('movies-search', { movies: processedMovies, queryType });
//     } catch (err) {
//         console.error('Error fetching data:', err.stack);
//         res.status(500).send('Error fetching data');
//     }
// });

router.get('/movies-search', async (req, res) => {
    const title = req.query.title || '';
    let queryType = 'All Movies';

    try {
        let movies;

        if (title) {
            console.log('Searching for movies with title:', title);
            queryType = `Movies with title: ${title}`;
            movies = await database.searchMovies(title);
        } else {
            console.log('Fetching all movies...');
            movies = await database.getMovies();
        }

        if (!movies || movies.length === 0) {
            // Render the page with an error message if no movies are found
            return res.render('movies-search', {
                movies: [],
                queryType,
                title,
                errorMessage: `No results found for "${title}". Please try another search.`,
            });
        }

        const processedMovies = movies.map(movie => ({
            ...movie,
            categories: movie.category.split(',').map(cat => cat.trim()),
        }));

        res.render('movies-search', { movies: processedMovies, queryType });
    } catch (err) {
        console.error('Error fetching data:', err.stack);
        res.status(500).render('movies-search', {
            movies: [],
            queryType: 'Error',
            errorMessage: 'An error occurred while fetching data. Please try again later.',
        });
    }
});

/**
 * @route GET /searchFilm
 * @description Searches for movies by query
 * @param {Object} req - Express request object
 * @param {Object} req.query - Request query
 * @param {string} req.query.query - Search query
 * @param {Object} res - Express response object
 * @returns {void}
 */
router.get('/searchFilm', async (req, res) => {
    const query = req.query.query;
    try {
        const movies = await database.searchFilm(query);
        res.json(movies);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).send('Internal Server Error');
    }
  });

/**
 * Handles the POST request to add a new movie to the database.
 *
 * @param {object} req - The request object containing information about the movie to add to the database.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 */
router.post('/add-movie', upload.single('poster'), async (req, res) => {
    if(req.session.isAdmin) {
        const { title, runtime, descriptions, year, directors, casts, category } = req.body;
        const poster = req.file ? `images/${req.file.filename}` : '';

        try {
            await database.addMovie(title, poster, runtime, descriptions, year, directors, casts, category);
            res.redirect('/admin'); // Redirect to the admin page after adding
        } catch (err) {
            console.error('Error inserting data:', err.stack);
            res.status(500).send('Error inserting data');
        }
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
});

router.get('/edit-movie/:id', async (req, res) => {
    if(req.session.isAdmin) {
        try {
            const id = req.params.id;
            console.log(`Searching for movie data with id: ${id}`);
            const movies = await database.searchMoviesforEdit(id);
            if (movies.length > 0) {
                const movie = movies[0];
                movie.isActive = movie.isActive ? Boolean(movie.isActive) : false; // Ensure isActive is a Boolean
                movie.showPoster = movie.showPoster ? Boolean(movie.showPoster) : false;
                console.log(`Movie data found: ${JSON.stringify(movie)}`);
                res.render('edit-movie', { movie });
            } else {
                console.error('No movie found with the given id');
                res.status(404).send('No movie found');
            }
        } catch (err) {
            console.error('Error fetching movie data:', err.stack);
            res.status(500).send('Error fetching movie data');
        }
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
});

/**
 * Handles the POST request to update an existing movie in the database.
 * It updates the movie in the database and redirects to the movies list page after successful update.
 * If an error occurs during the update process, it logs the error and sends an error response to the client.
 *
 * @param {object} req - The request object containing information about the movie to update.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 *
 */
router.post('/edit-movie', upload.single('poster'), async (req, res) => {
    if (req.session.isAdmin) {
        const { id, title, runtime, descriptions, year, directors, casts, category, isActive, showPoster, currentPoster } = req.body;
        const poster = req.file ? `images/${req.file.filename}` : currentPoster;

        console.log('Received form data:', req.body); // Add this line to see all the form data received
        console.log('Received file data:', req.file); // Add this line to see the file data received

        try {
            await database.updateMovie(id, title, poster, runtime, descriptions, year, directors, casts, category, isActive, showPoster);
            console.log('Movie updated successfully');
            res.redirect('/admin'); // Redirect to the admin page after editing
        } catch (err) {
            console.error('Error updating data:', err.stack);
            res.status(500).send('Error updating data');
        }
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
});

/**
 * Handles the POST request to delete a movie from the database.
 * It deletes the movie with the given title from the database and sends a response back to the client.
 * If the movie is successfully deleted, it sends a JSON response with a success message.
 * If no movie is found with the given title, it sends a 404 status code with a JSON response indicating the error.
 * If an error occurs during the deletion process, it logs the error and sends a 500 status code with a JSON response indicating the error.
 *
 * @param {object} req - The request object containing information about the movie to delete.
 * @param {object} res - The response object used to send a response back to the client.
 *
 * @returns {void} This function does not return any value.
 *
 */
router.post('/delete-movie/:id', async (req, res) => {
    if(req.session.isAdmin) {
        try {
            const id = req.params.id;
            console.log(`Deleting movie with title: ${id}`);
            
            const result = await database.deleteMovie(id);
            if (result.affectedRows > 0) {
                res.json({ message: 'Movie deleted successfully' });
            } else {
                res.status(404).json({ message: 'No movie found with the given title' });
            }
        } catch (err) {
            console.error('Error deleting movie:', err.stack);
            res.status(500).json({ message: 'Error deleting movie' });
        }
    } else {
        res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }    
});

// Export the router
module.exports = router;
