import { openDatabase } from 'react-native-sqlite-storage';

const database = openDatabase({ name: 'RNTask.db', location: 'default' });

// Initialize the database and create the Users table if it doesn't exist
export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )`,
                [],
                () => {
                    console.log('Users Table Created');
                    resolve();
                },
                (tx, error) => {
                    console.log(`Error Creating Table ${JSON.stringify(tx)}`);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

// Check if a user with the given email exists in the Users table
export function checkExistingUser(email) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ?',
                [email],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(true); // User exists
                    } else {
                        resolve(false); // User doesn't exist
                    }
                },
                (tx, error) => {
                    console.log(`User ${tx}`);
                    reject(error); // Error occurred while checking username
                }
            );
        });
    });

    return promise;
}

// Create a new user in the Users table
export function createUser(user) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO Users (name, email, password) VALUES (?,?,?)`,
                [user.name, user.email, user.password],
                (_, result) => {
                    console.log(`Users res ${JSON.stringify(result)}`);
                    if (result.rowsAffected > 0) {
                        // Get the last inserted row ID
                        const lastInsertedId = result.insertId;

                        // Query the inserted row
                        tx.executeSql(
                            `SELECT * FROM Users WHERE id = ?`,
                            [lastInsertedId],
                            (_, queryResult) => {
                                if (queryResult.rows.length > 0) {
                                    resolve(queryResult);
                                } else {
                                    reject(new Error('Failed to retrieve inserted data'));
                                }
                            },
                            (_, queryError) => {
                                reject(queryError);
                            }
                        );
                    } else {
                        reject(new Error('Failed to insert data'));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

// Login a user by checking their email and password in the Users table
export function loginUser(email, password) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ? AND password = ?',
                [email, password],
                (_, result) => {
                    if (result.rows.length > 0) {
                        resolve({ success: true, result: result }); // Login successful
                    } else {
                        resolve({ success: false, result: result }); // Invalid username or password
                    }
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

// Fetch a user by their ID from the Users table
export function fetchUserById(userId) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Users WHERE id = ?',
                [userId],
                (_, result) => {
                    console.log(`Users res ${JSON.stringify(result)}`);
                    if (result.rows.length > 0) {
                        resolve({ success: true, result: result }); // User found
                    } else {
                        resolve({ success: false, result: result }); // User not found
                    }
                },
                (tx, error) => {
                    console.log(`Fetch Error ${tx}`);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

// Delete a user by their ID from the Users table
export function deleteUser(userId) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM Users WHERE id = ?',
                [userId],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        resolve({ success: true, message: 'User deleted successfully' });
                    } else {
                        resolve({ success: false, message: 'User not found' });
                    }
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

