// In utils/formValidator.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  export const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(phone);
  };
  
  // Usage example in a form component:
  // const [errors, setErrors] = useState({});
  // if (!validateEmail(formData.email)) {
  //   setErrors(prev => ({...prev, email: 'Invalid email address'}));
  // }