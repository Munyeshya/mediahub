// server/gen-hash.js
import bcrypt from 'bcryptjs';

const password = 'newpassword123'; // ← change to your desired new password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  console.log('Generated hash:', hash);
});
