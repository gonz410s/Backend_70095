// User.js
class User {
  constructor(name, email, age, password, username) {
    this.id = `USR-${Date.now()}${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.email = email;
    this.age = age;
    this.password = password;
    this.username = username;
    this.createdAt = new Date();
    console.log('User created:', this);
  }
}

module.exports = User;