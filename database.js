const mysql = require('mysql2')
const dotenv = require(`dotenv`)
const { v4: uuidv4 } = require('uuid');

dotenv.config()

// A collection of connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    typeCast: function castField( field, useDefaultTypeCasting ) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return +( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );
    }
}).promise()

/*pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database.');
        connection.release(); // Release the connection back to the pool
    }
});*/

const database = {
    getRows: async (table) => {
        const [rows] = await pool.query(`SELECT * FROM ${table}`); // This is safe because the table variable is not a user input
    
        return rows;
    },
    getRow: async (table, id) => {
        const [rows] = await pool.query(`
            SELECT * 
            FROM ${table}
            WHERE id = ?
        `, [id]); // The id variable
    
        return rows[0];
    },
    createUser: async (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt) => {
        await pool.query(`
        INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `, [id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt])
        
        return this.getRow('users', id)
    },
    createAdminRoles: async (id, name, isDefault, createdAt, updatedAt) => {
        await pool.query(`
        INSERT INTO adminRoles (id, name, isDefault, createdAt, updatedAt)
        VALUES (?,?,?,?,?)
        `, [id, name, isDefault, createdAt, updatedAt])
        
        return this.getRow('adminRoles', id);
    },
    createAdmin: async (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt) => {
        await pool.query(`
        INSERT INTO admin (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt)
        VALUES (?,?,?,?,?,?,?,?,?)
        `, [id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt])
        
        return this.getRow('admin', id);
    },
    createAdminPermissions: async (id, roleId, name, createdAt, updatedAt) => {
        await pool.query(`
        INSERT INTO adminPermissions (id, roleId, name, createdAt, updatedAt)
        VALUES (?,?,?,?,?)
        `, [id, roleId, name, createdAt, updatedAt])
        
        return this.getRow('adminPermissions', id);
    },
    dropRow: async (table, id) => {
        await pool.query(`
        DELETE FROM ${table}
        WHERE id = ?
        `, [id]);

        return this.getRows(table);
    },
    getMovies: async () => {
        const [rows] = await pool.query('SELECT * FROM movies WHERE isActive = 1');
        return rows;
    },
    searchMovies: async (title) => {
        const [rows] = await pool.query('SELECT * FROM movies WHERE title LIKE ? AND isActive = 1', [`%${title}%`]);
        return rows;
    },
    addMovie: async (title, poster, runtime, descriptions, year, directors, casts, category) => {
        const [result] = await pool.query(`
        INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category, isActive, showPoster)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, poster, runtime, descriptions, year, directors, casts, category, 1, 0]);
        return result;
    },

    searchMoviesforEdit: async (id) => {
        try {
            console.log(`Searching for movies with id: ${id}`);
            const query = 'SELECT * FROM movies WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            console.log(`Movies found: ${JSON.stringify(rows)}`);
            return rows;
        } catch (err) {
            console.error('Error searching for movies:', err.stack);
            throw err;
        }
    },

    searchFilm: async (query) => {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM movies 
                WHERE title LIKE ? AND isActive = 1
            `, [`%${query}%`]);
            
            return rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error; 
        }
    },

    searchFilmforCarousel: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM movies 
                WHERE isActive = 1 AND showPoster = 1
            `);
            
            return rows;
        } catch (error) {
            console.error('Error executing query', error);
            throw error; 
        }
    },

    updateMovie: async (id, title, poster, runtime, descriptions, year, directors, casts, category, isActive, showPoster) => {
        try {
            const isActiveBit = isActive === 'true' ? 1 : 0; // Convert to bit
            const showPosterBit = showPoster === 'true' ? 1 : 0;
            console.log('Updating movie:', { id, title, poster, runtime, descriptions, year, directors, casts, category, isActive: isActiveBit, showPoster: showPosterBit});
            await pool.query(`
                UPDATE movies 
                SET title = ?, poster = ?, runtime = ?, descriptions = ?, year = ?, directors = ?, casts = ?, category = ?, isActive = ?, showPoster = ?
                WHERE id = ?
            `, [title, poster, runtime, descriptions, year, directors, casts, category, isActiveBit, showPosterBit, id]);
            console.log('Movie updated successfully in database');
        } catch (err) {
            console.error('Error updating movie in database:', err.stack);
            throw err;
        }
    },
    deleteMovie: async (id) => {
        try {
            const query = 'DELETE FROM movies WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result;
        } catch (err) {
            console.error('Error deleting movie from database:', err.stack);
            throw err;
        }
    },
    getUserById: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0]; 
    
        if (user) {
            const [adminRows] = await pool.query('SELECT * FROM admin WHERE emailAddress = ?', [user.emailAddress]);
            user.isAdmin = adminRows.length > 0; // Check if the user is in the admin table
        }
    
        return user;
    },
    getUserByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE emailAddress = ?', [email]);
        return rows[0];
    },
    getAdminByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM admin WHERE emailAddress = ?', [email]);
        return rows[0];
    },

    addUser: async (firstName, lastName, emailAddress, password) => {
        const newAccountId = uuidv4();
        const [result] = await pool.query(`
        INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, currency, emailAddressVerifiedAt, createdAt,
        updatedAt, invitationExpiresAt )
        VALUES (?, ?, ?, ?, ?, 1, ?, 'PHP', NULL, NOW(), NOW(), NULL)
        `, [newAccountId, firstName, lastName, emailAddress, password]);
        return result;
    },

    recordFailedLoginAttempt: async (emailAddress, failedLoginAttempts, lastLoginFail, accountLockedUntil) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            await connection.query(`
                UPDATE users 
                SET failedLoginAttempts = ?, lastLoginFail = ?, accountLockedUntil = ?, lastLoginInteraction = NOW()
                WHERE emailAddress = ?
            `, [failedLoginAttempts, lastLoginFail, accountLockedUntil, emailAddress]);
            await connection.commit();
            connection.release();

        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error('Error updating user:', err);
            throw err;
        }
    },

    resetFailedLoginAttempt: async (emailAddress) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            // Modified query to include lastLoginInteraction update
            await connection.query(`
                UPDATE users 
                SET failedLoginAttempts = 0,
                    accountLockedUntil = NULL,
                    lastLoginInteraction = NOW()  // Add this line
                WHERE emailAddress = ?
            `, [emailAddress]);
            
            await connection.commit();
            connection.release();
        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error('Error updating user:', err);
            throw err;
        }
    },

    resetFailedLoginAttempt: async (emailAddress) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            await connection.query(`
                UPDATE users 
                SET failedLoginAttempts = ?, accountLockedUntil = ?, lastLoginInteraction = NOW()
                WHERE emailAddress = ?
            `, [0, null, emailAddress]);
            await connection.commit();
            connection.release();

        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error('Error updating user:', err);
            throw err;
        }
    },

    addPasswordHistory: async (userId, password) => {
        const newHistoryId = uuidv4();
        const [result] = await pool.query(`
        INSERT INTO passwordhistory (id, userId, password, changeDate)
        VALUES (?, ?, ?, NOW())
        `, [newHistoryId, userId, password]);
        return result;
    },

    getPasswordAge: async (userId) => {
        const [rows] = await pool.query(`
            SELECT DATEDIFF(NOW(), changeDate) AS passwordAge
            FROM passwordhistory 
            WHERE userId = ? 
            ORDER BY changeDate DESC 
            LIMIT 1;
        `, [userId]);

        return rows[0].passwordAge;
    },

    getLatestPasswords: async (userId) => {
        const [rows] = await pool.query(`
            SELECT * FROM passwordhistory
            WHERE userId = ? 
            ORDER BY changeDate DESC 
            LIMIT 5;
        `, [userId]);

        return rows;
    },

    addUserWRecovery: async (firstName, lastName, emailAddress, password, type, recoveryQuestion, recoveryAnswer) => {
        const newAccountId = uuidv4();
        const [result] = await pool.query(`
        INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt,
        updatedAt, invitationExpiresAt, securityQuestionID, securityQuestionAnswer)
        VALUES (?, ?, ?, ?, ?, 1, ?, 'PHP', NULL, NOW(), NOW(), NULL, ?, ?)
        `, [newAccountId, firstName, lastName, emailAddress, password, type, recoveryQuestion, recoveryAnswer]);
        return result;
    },

    searchUser: async (query) => {
        const [rows] = await pool.query(`
            SELECT * FROM users 
            WHERE firstName LIKE ? OR lastName LIKE ?
        `, [`%${query}%`, `%${query}%`]);

        return rows;
    },

    validateRecoveryInfo: async (email, securityQuestionID) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE emailAddress = ? AND securityQuestionID = ?', [email, securityQuestionID]);
        return rows[0];
    },

    changePassword: async (emailAddress, password) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        console.log(password, emailAddress);
        try {
            // Update user details
            await connection.query(`
                UPDATE users 
                SET password = ?
                WHERE emailAddress = ?
            `, [password, emailAddress]);
            await connection.commit();
            connection.release();

        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error('Error updating user:', err);
            throw err;
        }
    },

    updateUser: async (id, firstName, lastName, emailAddress, password, isAdmin) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
    
        try {
            // Fetch current user details
            const [currentUser] = await connection.query(`
                SELECT firstName, lastName, emailAddress, password FROM users WHERE id = ?
            `, [id]);
        
            const currentDetails = currentUser[0];
        
            // Update user details
            await connection.query(`
                UPDATE users 
                SET firstName = ?, lastName = ?, emailAddress = ?, password = ?
                WHERE id = ?
            `, [firstName, lastName, emailAddress, password, id]);
        
            // Check if user is currently an admin
            const [adminUser] = await connection.query(`
                SELECT * FROM admin WHERE emailAddress = ?
            `, [currentDetails.emailAddress]);
        
            if (isAdmin) {
                // Add to admin table if not already an admin or update existing admin details
                if (adminUser.length === 0) {
                    const newAdminId = uuidv4();
                    await connection.query(`
                        INSERT INTO admin (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                    `, [newAdminId, 'de6b0c20-24a3-11ed-b041-274cb1435614', firstName, lastName, emailAddress, password, 1]);
                } else {
                    // Update admin details if any have changed
                    await connection.query(`
                        UPDATE admin 
                        SET firstName = ?, lastName = ?, emailAddress = ?, password = ?, updatedAt = NOW()
                        WHERE emailAddress = ?
                    `, [firstName, lastName, emailAddress, password, currentDetails.emailAddress]);
                }
            } else {
                // Remove from admin table if already an admin
                if (adminUser.length > 0) {
                    await connection.query(`
                        DELETE FROM admin WHERE emailAddress = ?
                    `, [currentDetails.emailAddress]);
                }
            }
        
            // Commit the transaction
            await connection.commit();
            connection.release();
        
            // Fetch updated user details
            const [updatedUser] = await pool.query(`
                SELECT * FROM users WHERE id = ?
            `, [id]);
        
            return updatedUser[0];
        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error('Error updating user:', err);
            throw err;
        }
    },

    deleteUser: async (id, isAdmin) => {
        try {
          //delete from the admin table if the user is an admin
          if(isAdmin){
            await pool.query(`
                DELETE FROM admin WHERE emailAddress = (SELECT emailAddress FROM users WHERE id = ?)
              `, [id]);
          }
    
          // Then, delete from the users table
          await pool.query(`
            DELETE FROM users WHERE id = ?
          `, [id]);
    
          return { message: 'User deleted successfully' };
        } catch (err) {
          console.error('Error deleting user:', err);
          throw err;
        }
    },

    addColumn: async (table, columnName, dataType) => {
        try {
            await pool.query(`ALTER TABLE ?? ADD ?? ${dataType}`, [table, columnName]);
            console.log(`Column ${columnName} added to table ${table}`);
        } catch (err) {
            console.error('Error adding column:', err);
            throw err;
        }
    },
}

module.exports = {pool, database};


// const mysql = require('mysql2')
// const dotenv = require(`dotenv`)
// const { v4: uuidv4 } = require('uuid');

// dotenv.config()

// // A collection of connections
// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     port: process.env.MYSQL_PORT,
//     typeCast: function castField( field, useDefaultTypeCasting ) {

//         // We only want to cast bit fields that have a single-bit in them. If the field
//         // has more than one bit, then we cannot assume it is supposed to be a Boolean.
//         if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

//             var bytes = field.buffer();

//             // A Buffer in Node represents a collection of 8-bit unsigned integers.
//             // Therefore, our single "bit field" comes back as the bits '0000 0001',
//             // which is equivalent to the number 1.
//             return +( bytes[ 0 ] === 1 );

//         }

//         return( useDefaultTypeCasting() );
//     }
// }).promise()

// /*pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//     } else {
//         console.log('Connected to the database.');
//         connection.release(); // Release the connection back to the pool
//     }
// });*/

// const database = {
//     getRows: async (table) => {
//         const [rows] = await pool.query(`SELECT * FROM ${table}`); // This is safe because the table variable is not a user input
    
//         return rows;
//     },
//     getRow: async (table, id) => {
//         const [rows] = await pool.query(`
//             SELECT * 
//             FROM ${table}
//             WHERE id = ?
//         `, [id]); // The id variable
    
//         return rows[0];
//     },
//     createUser: async (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt) => {
//         await pool.query(`
//         INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt)
//         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
//         `, [id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt, updatedAt, invitationExpiresAt])
        
//         return this.getRow('users', id)
//     },
//     createAdminRoles: async (id, name, isDefault, createdAt, updatedAt) => {
//         await pool.query(`
//         INSERT INTO adminRoles (id, name, isDefault, createdAt, updatedAt)
//         VALUES (?,?,?,?,?)
//         `, [id, name, isDefault, createdAt, updatedAt])
        
//         return this.getRow('adminRoles', id);
//     },
//     createAdmin: async (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt) => {
//         await pool.query(`
//         INSERT INTO admin (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt)
//         VALUES (?,?,?,?,?,?,?,?,?)
//         `, [id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt])
        
//         return this.getRow('admin', id);
//     },
//     createAdminPermissions: async (id, roleId, name, createdAt, updatedAt) => {
//         await pool.query(`
//         INSERT INTO adminPermissions (id, roleId, name, createdAt, updatedAt)
//         VALUES (?,?,?,?,?)
//         `, [id, roleId, name, createdAt, updatedAt])
        
//         return this.getRow('adminPermissions', id);
//     },
//     dropRow: async (table, id) => {
//         await pool.query(`
//         DELETE FROM ${table}
//         WHERE id = ?
//         `, [id]);

//         return this.getRows(table);
//     },
//     getMovies: async () => {
//         const [rows] = await pool.query('SELECT * FROM movies WHERE isActive = 1');
//         return rows;
//     },
//     searchMovies: async (title) => {
//         const [rows] = await pool.query('SELECT * FROM movies WHERE title LIKE ? AND isActive = 1', [`%${title}%`]);
//         return rows;
//     },
//     addMovie: async (title, poster, runtime, descriptions, year, directors, casts, category) => {
//         const [result] = await pool.query(`
//         INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category, isActive, showPoster)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `, [title, poster, runtime, descriptions, year, directors, casts, category, 1, 0]);
//         return result;
//     },

//     searchMoviesforEdit: async (id) => {
//         try {
//             console.log(`Searching for movies with id: ${id}`);
//             const query = 'SELECT * FROM movies WHERE id = ?';
//             const [rows] = await pool.query(query, [id]);
//             console.log(`Movies found: ${JSON.stringify(rows)}`);
//             return rows;
//         } catch (err) {
//             console.error('Error searching for movies:', err.stack);
//             throw err;
//         }
//     },

//     searchFilm: async (query) => {
//         try {
//             const [rows] = await pool.query(`
//                 SELECT * FROM movies 
//                 WHERE title LIKE ? AND isActive = 1
//             `, [`%${query}%`]);
            
//             return rows;
//         } catch (error) {
//             console.error('Error executing query', error);
//             throw error; 
//         }
//     },

//     searchFilmforCarousel: async () => {
//         try {
//             const [rows] = await pool.query(`
//                 SELECT * FROM movies 
//                 WHERE isActive = 1 AND showPoster = 1
//             `);
            
//             return rows;
//         } catch (error) {
//             console.error('Error executing query', error);
//             throw error; 
//         }
//     },

//     updateMovie: async (id, title, poster, runtime, descriptions, year, directors, casts, category, isActive, showPoster) => {
//         try {
//             const isActiveBit = isActive === 'true' ? 1 : 0; // Convert to bit
//             const showPosterBit = showPoster === 'true' ? 1 : 0;
//             console.log('Updating movie:', { id, title, poster, runtime, descriptions, year, directors, casts, category, isActive: isActiveBit, showPoster: showPosterBit});
//             await pool.query(`
//                 UPDATE movies 
//                 SET title = ?, poster = ?, runtime = ?, descriptions = ?, year = ?, directors = ?, casts = ?, category = ?, isActive = ?, showPoster = ?
//                 WHERE id = ?
//             `, [title, poster, runtime, descriptions, year, directors, casts, category, isActiveBit, showPosterBit, id]);
//             console.log('Movie updated successfully in database');
//         } catch (err) {
//             console.error('Error updating movie in database:', err.stack);
//             throw err;
//         }
//     },
//     deleteMovie: async (id) => {
//         try {
//             const query = 'DELETE FROM movies WHERE id = ?';
//             const [result] = await pool.query(query, [id]);
//             return result;
//         } catch (err) {
//             console.error('Error deleting movie from database:', err.stack);
//             throw err;
//         }
//     },
//     getUserById: async (userId) => {
//         const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
//         const user = rows[0]; 
    
//         if (user) {
//             const [adminRows] = await pool.query('SELECT * FROM admin WHERE emailAddress = ?', [user.emailAddress]);
//             user.isAdmin = adminRows.length > 0; // Check if the user is in the admin table
//         }
    
//         return user;
//     },
//     getUserByEmail: async (email) => {
//         const [rows] = await pool.query('SELECT * FROM users WHERE emailAddress = ?', [email]);
//         return rows[0];
//     },
//     getAdminByEmail: async (email) => {
//         const [rows] = await pool.query('SELECT * FROM admin WHERE emailAddress = ?', [email]);
//         return rows[0];
//     },

//     addUser: async (firstName, lastName, emailAddress, password) => {
//         const newAccountId = uuidv4();
//         const [result] = await pool.query(`
//         INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, currency, emailAddressVerifiedAt, createdAt,
//         updatedAt, invitationExpiresAt )
//         VALUES (?, ?, ?, ?, ?, 1, ?, 'PHP', NULL, NOW(), NOW(), NULL)
//         `, [newAccountId, firstName, lastName, emailAddress, password]);
//         return result;
//     },

//     recordFailedLoginAttempt: async (emailAddress, failedLoginAttempts, lastLoginFail, accountLockedUntil) => {
//         const connection = await pool.getConnection();
//         await connection.beginTransaction();
//         try {
//             await connection.query(`
//                 UPDATE users 
//                 SET failedLoginAttempts = ?, lastLoginFail = ?, accountLockedUntil = ?, lastLoginInteraction = NOW()
//                 WHERE emailAddress = ?
//             `, [failedLoginAttempts, lastLoginFail, accountLockedUntil, emailAddress]);
//             await connection.commit();
//             connection.release();

//         } catch (err) {
//             await connection.rollback();
//             connection.release();
//             console.error('Error updating user:', err);
//             throw err;
//         }
//     },

//     resetFailedLoginAttempt: async (emailAddress) => {
//         const connection = await pool.getConnection();
//         await connection.beginTransaction();
//         try {
//             // Modified query to include lastLoginInteraction update
//             await connection.query(`
//                 UPDATE users 
//                 SET failedLoginAttempts = 0,
//                     accountLockedUntil = NULL,
//                     lastLoginInteraction = NOW()  // Add this line
//                 WHERE emailAddress = ?
//             `, [emailAddress]);
            
//             await connection.commit();
//             connection.release();
//         } catch (err) {
//             await connection.rollback();
//             connection.release();
//             console.error('Error updating user:', err);
//             throw err;
//         }
//     },

//     resetFailedLoginAttempt: async (emailAddress) => {
//         const connection = await pool.getConnection();
//         await connection.beginTransaction();
//         try {
//             await connection.query(`
//                 UPDATE users 
//                 SET failedLoginAttempts = ?, accountLockedUntil = ?, lastLoginInteraction = NOW()
//                 WHERE emailAddress = ?
//             `, [0, null, emailAddress]);
//             await connection.commit();
//             connection.release();

//         } catch (err) {
//             await connection.rollback();
//             connection.release();
//             console.error('Error updating user:', err);
//             throw err;
//         }
//     },

//     addPasswordHistory: async (userId, password) => {
//         const newHistoryId = uuidv4();
//         const [result] = await pool.query(`
//         INSERT INTO passwordhistory (id, userId, password, changeDate)
//         VALUES (?, ?, ?, NOW())
//         `, [newHistoryId, userId, password]);
//         return result;
//     },

//     getPasswordAge: async (userId) => {
//         const [rows] = await pool.query(`
//             SELECT DATEDIFF(NOW(), changeDate) AS passwordAge
//             FROM passwordhistory 
//             WHERE userId = ? 
//             ORDER BY changeDate DESC 
//             LIMIT 1;
//         `, [userId]);

//         return rows[0].passwordAge;
//     },

//     getLatestPasswords: async (userId) => {
//         const [rows] = await pool.query(`
//             SELECT * FROM passwordhistory
//             WHERE userId = ? 
//             ORDER BY changeDate DESC 
//             LIMIT 5;
//         `, [userId]);

//         return rows;
//     },

//     addUserWRecovery: async (firstName, lastName, emailAddress, password, type, recoveryQuestion, recoveryAnswer) => {
//         const newAccountId = uuidv4();
//         const [result] = await pool.query(`
//         INSERT INTO users (id, firstName, lastName, emailAddress, password, isActive, type, currency, emailAddressVerifiedAt, createdAt,
//         updatedAt, invitationExpiresAt, securityQuestionID, securityQuestionAnswer)
//         VALUES (?, ?, ?, ?, ?, 1, ?, 'PHP', NULL, NOW(), NOW(), NULL, ?, ?)
//         `, [newAccountId, firstName, lastName, emailAddress, password, type, recoveryQuestion, recoveryAnswer]);
//         return result;
//     },

//     searchUser: async (query) => {
//         const [rows] = await pool.query(`
//             SELECT * FROM users 
//             WHERE firstName LIKE ? OR lastName LIKE ?
//         `, [`%${query}%`, `%${query}%`]);

//         return rows;
//     },

//     validateRecoveryInfo: async (email, securityQuestionID) => {
//         const [rows] = await pool.query('SELECT * FROM users WHERE emailAddress = ? AND securityQuestionID = ?', [email, securityQuestionID]);
//         return rows[0];
//     },

//     changePassword: async (emailAddress, password) => {
//         const connection = await pool.getConnection();
//         await connection.beginTransaction();
        
//         console.log(password, emailAddress);
//         try {
//             // Update user details
//             await connection.query(`
//                 UPDATE users 
//                 SET password = ?
//                 WHERE emailAddress = ?
//             `, [password, emailAddress]);
//             await connection.commit();
//             connection.release();

//         } catch (err) {
//             await connection.rollback();
//             connection.release();
//             console.error('Error updating user:', err);
//             throw err;
//         }
//     },

//     updateUser: async (id, firstName, lastName, emailAddress, password, isAdmin) => {
//         const connection = await pool.getConnection();
//         await connection.beginTransaction();
    
//         try {
//             // Fetch current user details
//             const [currentUser] = await connection.query(`
//                 SELECT firstName, lastName, emailAddress, password FROM users WHERE id = ?
//             `, [id]);
        
//             const currentDetails = currentUser[0];
        
//             // Update user details
//             await connection.query(`
//                 UPDATE users 
//                 SET firstName = ?, lastName = ?, emailAddress = ?, password = ?
//                 WHERE id = ?
//             `, [firstName, lastName, emailAddress, password, id]);
        
//             // Check if user is currently an admin
//             const [adminUser] = await connection.query(`
//                 SELECT * FROM admin WHERE emailAddress = ?
//             `, [currentDetails.emailAddress]);
        
//             if (isAdmin) {
//                 // Add to admin table if not already an admin or update existing admin details
//                 if (adminUser.length === 0) {
//                     const newAdminId = uuidv4();
//                     await connection.query(`
//                         INSERT INTO admin (id, roleId, firstName, lastName, emailAddress, password, isActive, createdAt, updatedAt) 
//                         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//                     `, [newAdminId, 'de6b0c20-24a3-11ed-b041-274cb1435614', firstName, lastName, emailAddress, password, 1]);
//                 } else {
//                     // Update admin details if any have changed
//                     await connection.query(`
//                         UPDATE admin 
//                         SET firstName = ?, lastName = ?, emailAddress = ?, password = ?, updatedAt = NOW()
//                         WHERE emailAddress = ?
//                     `, [firstName, lastName, emailAddress, password, currentDetails.emailAddress]);
//                 }
//             } else {
//                 // Remove from admin table if already an admin
//                 if (adminUser.length > 0) {
//                     await connection.query(`
//                         DELETE FROM admin WHERE emailAddress = ?
//                     `, [currentDetails.emailAddress]);
//                 }
//             }
        
//             // Commit the transaction
//             await connection.commit();
//             connection.release();
        
//             // Fetch updated user details
//             const [updatedUser] = await pool.query(`
//                 SELECT * FROM users WHERE id = ?
//             `, [id]);
        
//             return updatedUser[0];
//         } catch (err) {
//             await connection.rollback();
//             connection.release();
//             console.error('Error updating user:', err);
//             throw err;
//         }
//     },

//     deleteUser: async (id, isAdmin) => {
//         try {
//           //delete from the admin table if the user is an admin
//           if(isAdmin){
//             await pool.query(`
//                 DELETE FROM admin WHERE emailAddress = (SELECT emailAddress FROM users WHERE id = ?)
//               `, [id]);
//           }
    
//           // Then, delete from the users table
//           await pool.query(`
//             DELETE FROM users WHERE id = ?
//           `, [id]);
    
//           return { message: 'User deleted successfully' };
//         } catch (err) {
//           console.error('Error deleting user:', err);
//           throw err;
//         }
//     },

//     addColumn: async (table, columnName, dataType) => {
//         try {
//             await pool.query(`ALTER TABLE ?? ADD ?? ${dataType}`, [table, columnName]);
//             console.log(`Column ${columnName} added to table ${table}`);
//         } catch (err) {
//             console.error('Error adding column:', err);
//             throw err;
//         }
//     },
// }

// // Log event function
// const logEvent = async (eventType, details) => {
//     try {
//       await pool.query(
//         `INSERT INTO logs (timestamp, eventType, details) VALUES (NOW(), ?, ?)`,
//         [eventType, details]
//       );
//     } catch (error) {
//       console.error('Error logging event:', error);
//     }
// };

// module.exports = {pool, database, logEvent};
