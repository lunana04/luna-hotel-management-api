const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

const API_URL = 'http://localhost:3000/api/v1/users';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhN2Y1YjQ1LWZlYWMtNDJhOC05YWQ5LTFhYTAxZDI1NjBiZiIsImlhdCI6MTc1MDAxOTQ4OCwiZXhwIjoxNzUwMTA1ODg4fQ.nHE8dEZkQxExhkPQQey3arunbZ6WCA9peqOthrqTVlQ"';

async function seedUsers() {
  const results = [];

  fs.createReadStream('NORMALusers.csv')
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      console.log(`Seeding ${results.length} users...\n`);

      for (const row of results) {
        try {
          if (!row.password || row.password.length < 8) {
            throw new Error('Password is missing or too short');
          }

          const userPayload = {
            firstName: row.firstName,
            lastName: row.lastName,
            emailAddress: row.emailAddress,
            password: row.password, 
            role: row.role || 'NORMAL',
          };

          console.log('Sending user:', userPayload.emailAddress);

          await axios.post(API_URL, userPayload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('Success:', userPayload.emailAddress);
        } catch (error) {
          console.error('Error with row:', row.emailAddress);
          if (error.response?.data) {
            console.error('Server Response:', JSON.stringify(error.response.data, null, 2));
          } else if (error.request) {
            console.error('No response received. Is server running?');
          } else {
            console.error('Error Message:', error.message);
          }
        }
      }

      console.log('\nSeeding complete.');
    });
}

seedUsers();
