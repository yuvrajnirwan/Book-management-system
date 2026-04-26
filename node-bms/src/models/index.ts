import User from './User.js';
import Role from './Role.js';
import Book from './Book.js';

// User and Role: Many-to-Many
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// Export all models
export { User, Role, Book };
