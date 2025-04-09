// Please read README.md for details
// Modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const {pool, database} = require('./database.js')
const multer = require('multer');
const accountRoutes = require('./public/js/Account.js')
const movieRoutes = require('./public/js/Movie.js');
const imageData = require('./public/js/carousel.json');
const fs = require('fs');
const filePath = './views/partials/team-text.hbs';

// Express setup
const app = express()
const port = 3000

// Middleware
app.use(cookieParser())
app.use(express.static('public')) // Sets the public folder as the default location for static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', '.hbs')
app.use(express.static(__dirname));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}))

// Routes
app.get('/', async (req, res) => {
  try {
      const carouselMovies = await database.searchFilmforCarousel();
      res.render('main', { images: carouselMovies });
  } catch (error) {
      console.error('Error fetching carousel movies:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/get-session-userid', (req, res) => {
  try {
    res.status(200).send(req.session.userId);
  } catch (e) {
    res.status(500).send('Failed to fetch session-info');
  }
});

app.get('/get-session-isadmin', (req, res) => {
  try {
    res.status(200).send(req.session.isAdmin);
  } catch (e) {
    res.status(500).send('Failed to fetch session-info');
  }
});

app.get('/get-about-us', (req, res) => {
  if (req.session.isAdmin) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).render('handling', {
          title: 'Error',
          body: 'Error reading About Us file.'
        });
      } else {
        const text = data.toString();
        res.status(200).json({ content: data, text: text });
      }
    });
  } else {
    res.status(500).render('handling', {
      title: 'Unauthorized Access',
      body: 'You are not authorized to access this page.'
    });
  }
});

app.get('/admin', (req, res) => {
  if (req.session.isAdmin) {
    res.render('admin');
  } else {
    res.status(401).render('handling', {
      title: 'Unauthorized Access',
      body: 'You are not authorized to access this page.'
    });
  }
});

app.post('/save-text', (req, res) => {
  if(req.session.isAdmin) {
    const newText = req.body.text;
    const textHtml = `${newText}`;

    fs.writeFile(filePath, textHtml, 'utf8', (err) => {
      if (err) {
        console.error('Error saving text:', err);
        res.status(500).json({ message: 'Error saving team text' });
      } else {
        //console.log('Team text saved successfully!');
        res.status(200).json({ message: 'Team text saved successfully!' });
      }
    });
  } else {
    res.status(401).render('handling', {
      title: 'Unauthorized Access',
      body: 'You are not authorized to access this page.'
    });
  }
});

app.get('/register', (req, res) => {
  req.session.destroy()
  res.render('register', { header: 'Sign Up'})
})

app.get('/login', (req, res) => {
  req.session.destroy()
  res.render('login')
})

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Fetch user or admin data based on email
  let adminData = await database.getAdminByEmail(email);
  let userData = await database.getUserByEmail(email);

  /*console.log(userData)
  console.log(userData === undefined)*/

  if(userData === undefined) {
    //console.log(1)
    res.status(401).send({success: false})
    return
  } else if(await bcrypt.compare(password, userData.password) == false) {
      //console.log(2)
    res.status(401).send({success: false})
  } else {
    if(!adminData) {
      req.session.isAdmin = false;
      res.status(200).send({success: true, isAdmin: false})
      
    } else {
      req.session.isAdmin = true;
      req.session.userId = userData.id;
      console.log(req.session.userId);
      console.log(userData.id);
      res.status(200).send({success: true, isAdmin: true})
    }
  }
})

app.get('/add-movie', (req, res) => {
  //res.render('add-movie');

  if(req.session.isAdmin) {
    res.render('add-movie')
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
})

app.get('/getRows', async (req, res) => {
  if(req.session.isAdmin) {
    const rows = await database.getRows(req.query.table)
    res.json(rows)
  
  } else {
    if(req.query.table === 'movies') {
      const rows = await database.getRows(req.query.table)
      res.json(rows)
    } else {
      res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
    }
  }

  /*const rows = await database.getRows(req.query.table)
  res.json(rows)*/
})

app.use('/', accountRoutes);
app.use('/', movieRoutes);

app.get('/add-account', async (req, res) => {
  if(req.session.isAdmin) {
    res.render('add-account', { header: 'Add An Account' })
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
});

// Route to render edit-account form
app.get('/edit-account/:id', async (req, res) => {
  if(req.session.isAdmin) {
  const userId = req.params.id;
    try {
      // Fetch user data from the database
      const user = await database.getUserById(userId);

      if (user) {
          // Render the edit-account template with the user data
          res.render('edit-account', {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              emailAddress: user.emailAddress,
              isAdmin: user.isAdmin
          });
      } else {
          res.status(404).send('User not found');
      }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
});

app.get('/browse', async (req, res) => {
  try {
      const movies = await database.getMovies(); 
      res.render('browse', { movies: movies });
  } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/orders' , async (req, res) => {
  res.render('orders')
});

// Add to app.js
app.post('/place-order', async (req, res) => {
  try {
    const userId = req.session.userId;
    const { movieId } = req.body;

    // Basic validation
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!movieId) return res.status(400).json({ success: false, message: 'Movie selection required' });

    // Check existing orders
    const existingOrder = await database.getOrdersByUserId(userId);
    if (existingOrder.length > 0) {
      return res.status(400).json({ success: false, message: 'You can only have one order' });
    }

    await database.createOrder(userId, movieId);
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Order failed' });
  }
});

app.get('/user-orders', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    
    const orders = await database.getOrdersByUserId(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

app.get('/blog' , async (req, res) => {
  res.render('blog')
});

app.get('/about-us', (req, res) => {
  res.render('about-us')
})

app.get('/check-user', async (req, res) => {

  try {
    const userData = await database.getUserByEmail(req.query.email)

    if(userData) {
      res.status(200).json({ exists : true })
    } else {
      res.status(200).json({ exists : false })
    }
  } catch (error) {
    console.error('Error checking account:', error)
    res.status(500).json({ error: 'Error checking account' })
  }
});

app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      // Redirect to the login page
      res.redirect('/login');
    }
  });
});

app.use((req, res) => {
  res.status(401).render('handling', { title: 'Page Not Found', body: 'Error 404. Page not found.' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

