const express = require('express');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const {pool, database} = require('../../database.js'); // Adjust the path as needed
const account = express.Router();
const bcrypt = require('bcrypt');

/**
 * @route POST /add-account
 * @description Adds a new user account
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.firstName - First name of the user
 * @param {string} req.body.lastName - Last name of the user
 * @param {string} req.body.emailAddress - Email address of the user
 * @param {string} req.body.password - Password of the user
 * @param {string} req.body.type - Type of the user (e.g., admin, user)
 * @param {int} req.body.recoveryQuestion - Type of the user (e.g., admin, user)
 * @param {string} req.body.recoveryAnswer - Security question answer
 * @param {Object} res - Express response object
 * @returns {void}
 */
account.post('/add-account', async (req, res) => {
  const { firstName, lastName, emailAddress, password, type, recoveryQuestion, recoveryAnswer} = req.body;
  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRecAnswer = await bcrypt.hash(recoveryAnswer, 10);
    await database.addUserWRecovery(firstName, lastName, emailAddress, hashedPassword, type, recoveryQuestion, hashedRecAnswer);
    res.status(200).send('Success inserting data');
  } catch (err) {
    console.error('Error inserting data:', err.stack);
    res.status(500).send('Error inserting data');
  }
});

account.post('/change-password', async (req, res) => {
  const {email, password} = req.body;
  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.changePassword(email, hashedPassword);
    res.status(200).send('Success updating data');
  } catch (err) {
    console.error('Error inserting data:', err.stack);
    res.status(500).send('Error updating data');
  }
});


/**
 * @route GET /searchUser
 * @description Searches for users by query
 * @param {Object} req - Express request object
 * @param {Object} req.query - Request query
 * @param {string} req.query.query - Search query
 * @param {Object} res - Express response object
 * @returns {void}
 */
account.get('/searchUser', async (req, res) => {
  if(req.session.isAdmin) {
    const query = req.query.query;
    try {
        const users = await database.searchUser(query);
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
});

/**
 * @route POST /update-account/:id
 * @description Updates a user account
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - ID of the user to update
 * @param {Object} req.body - Request body
 * @param {string} req.body.firstName - First name of the user
 * @param {string} req.body.lastName - Last name of the user
 * @param {string} req.body.emailAddress - Email address of the user
 * @param {string} req.body.password - Password of the user
 * @param {boolean} req.body.makeAdmin - Flag indicating if the user is an admin
 * @param {Object} res - Express response object
 * @returns {void}
 */
account.post('/update-account/:id', async (req, res) => {
  if(req.session.isAdmin) {
    const id = req.params.id; // Extract id from URL parameters
    const { firstName, lastName, emailAddress, password, makeAdmin } = req.body; // Extract other details from request body
    const hashedPassword =  await bcrypt.hash(password, 10);

    try {
      const updatedUser = await database.updateUser(id, firstName, lastName, emailAddress, hashedPassword, makeAdmin);
      // Send response with updated user details
      //res.status(200).send('User updated successfully');
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });

    } catch (error) {
      // Handle errors

      //res.status(500).send('Error updating user');
      res.status(500).json({
        message: 'Error updating user',
        error: error.message
      });
    }
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
});

/**
 * @route POST /delete-account/:id
 * @description Deletes a user account
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - ID of the user to delete
 * @param {Object} res - Express response object
 * @returns {void}
 */
account.post('/delete-account/:id', async (req, res) => {
  if(req.session.isAdmin) {
    const id = req.params.id; 

    try {
      // Fetch the user's email address to determine if they are an admin
      const [user] = await pool.query(`
        SELECT emailAddress FROM users WHERE id = ?
      `, [id]);

      if (user.length === 0) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const emailAddress = user[0].emailAddress;

      // Check if the user is an admin
      const [adminUser] = await pool.query(`
        SELECT * FROM admin WHERE emailAddress = ?
      `, [emailAddress]);

      const isAdmin = adminUser.length > 0;

      // Call the deleteUser function with the admin flag
      await database.deleteUser(id, isAdmin);

      // Send response confirming deletion
      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        message: 'Error deleting user',
        error: err.message
      });
    }
  } else {
    res.status(401).render('handling', { title: 'Unauthorized Access', body: 'You are not authorized to access this page.' });
  }
});

module.exports = account;