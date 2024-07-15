// Import required modules
const http = require('http');
const sqlite3 = require('sqlite3').verbose(); // verbose() for detailed stack traces
const express = require('express');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dist');

// Create a new SQLite database in memory (can be changed to a file path for a persistent database)
const db = new sqlite3.Database(dbPath);

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    // Define your routes and actions here
    if (req.url === '/create-table') {
        // Create a table in the SQLite database
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Table created or already exists.');
        });
    } else if (req.url === '/insert') {
        // Insert data into the SQLite database
        db.serialize(() => {
            db.run("INSERT INTO users (name) VALUES (?)", ["Alice"], function(err) {
                if (err) {
                    console.error(err.message);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error inserting data.');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Inserted row with id ${this.lastID}.`);
                }
            });
        });
    } else if (req.url === '/select') {
        // Select data from the SQLite database
        db.serialize(() => {
            db.all("SELECT * FROM users", [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error selecting data.');
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(rows));
                }
            });
        });
    } else {
        // Handle 404 - Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
