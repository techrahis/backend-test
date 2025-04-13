const passwordValidator = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) && // At least one uppercase letter
    /\d/.test(password) && // At least one digit
    /[!@#$%^&*(),.?":{}|<>]/.test(password) // At least one special character
  );
};

const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const phoneValidator = (phone) => {
  const re = /^\d{10}$/;
  return re.test(phone);
};

export { passwordValidator, emailValidator, phoneValidator };
