const db = require('../src/config/database');

async function seedData() {
  console.log('Seeding database with initial data...');

  // Sample schools
  const schools = [
    { name: 'Central High School', address: '123 Education St, City, State', contact_email: 'admin@centralhigh.edu', contact_phone: '(555) 123-4567' },
    { name: 'Eastside Academy', address: '456 Learning Ave, City, State', contact_email: 'info@eastsideacademy.edu', contact_phone: '(555) 987-6543' },
    { name: 'Westfield Secondary', address: '789 Knowledge Blvd, City, State', contact_email: 'office@westfieldsec.edu', contact_phone: '(555) 456-7890' }
  ];

  for (const school of schools) {
    const result = await db.query(
      'INSERT INTO schools (name, address, contact_email, contact_phone) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING RETURNING id',
      [school.name, school.address, school.contact_email, school.contact_phone]
    );
    console.log(`Seeded school: ${school.name}`);
  }

  // Sample users (passwords are hashed versions of 'Password123!')
  const sampleUsers = [
    {
      email: 'student1@example.com',
      password_hash: '$2b$12$EXAMPLERANDOMSTRINGWITHPROPERHASHFORMATHERE', // This is a placeholder hash
      first_name: 'John',
      last_name: 'Doe',
      role: 'student',
      school_id: 1,
      date_of_birth: '2008-05-15'
    },
    {
      email: 'student2@example.com',
      password_hash: '$2b$12$EXAMPLERANDOMSTRINGWITHPROPERHASHFORMATHERE', // This is a placeholder hash
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'student',
      school_id: 1,
      date_of_birth: '2007-11-22'
    },
    {
      email: 'psychologist1@example.com',
      password_hash: '$2b$12$EXAMPLERANDOMSTRINGWITHPROPERHASHFORMATHERE', // This is a placeholder hash
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      role: 'psychologist',
      school_id: 1
    }
  ];

  for (const user of sampleUsers) {
    try {
      const result = await db.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role, school_id, date_of_birth) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO NOTHING RETURNING id',
        [user.email, user.password_hash, user.first_name, user.last_name, user.role, user.school_id, user.date_of_birth]
      );
      if (result.rows.length > 0) {
        console.log(`Seeded user: ${user.email}`);
      } else {
        console.log(`User ${user.email} already exists`);
      }
    } catch (error) {
      console.error(`Error seeding user ${user.email}:`, error.message);
    }
  }

  console.log('Database seeding completed!');
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding finished.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };