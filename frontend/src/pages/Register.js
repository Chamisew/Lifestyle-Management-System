import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z][a-z]*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      return '';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password.length < 8) {
      return 'Password is too short';
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&]/.test(password)) {
      return 'Password is weak';
    } else if (passwordRegex.test(password)) {
      return 'Password is strong';
    } else {
      return 'Password is weak';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!validateName(name)) {
      newErrors.name = 'Name should start with a letter and contain only lowercase letters afterward.';
      valid = false;
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, and special characters.';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/users/register', { name, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-container">
      
      <h1>Register</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const newName = e.target.value;
              setName(newName);
              if (!validateName(newName)) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  name: 'Name should start with a letter and contain only lowercase letters afterward.',
                }));
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  name: '',
                }));
              }
            }}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              const newEmail = e.target.value;
              setEmail(newEmail);
              if (!validateEmail(newEmail)) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: 'Please enter a valid email address.',
                }));
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: '',
                }));
              }
            }}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              const newPassword = e.target.value;
              setPassword(newPassword);
              setPasswordStrength(checkPasswordStrength(newPassword));
            }}
            required
          />
          <p className={passwordStrength === 'Password is strong' ? 'password-strength' : 'error'}>
            {passwordStrength}
          </p>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
