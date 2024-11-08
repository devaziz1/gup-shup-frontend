export const validationRules = {
  email: [
    { required: true, message: "Email is required" },
    { max: 40, message: "Email must be at most 40 characters long" },
    {
      pattern: /^\S+@\S+\.\S+$/,
      message: "Please enter a valid email address",
    },
  ],

  password: [
    {
      required: true,
      message: "Password is required",
    },
    { max: 40, message: "Password must be at most 40 characters long" },
    { min: 6, message: "Password must be at least 6 characters long" },
    {
      validator: (_, value) => {
        if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
          return Promise.reject(
            new Error(
              "Password must contain at least one uppercase and one lowercase character"
            )
          );
        }
        return Promise.resolve();
      },
    },
  ],

  passwordLogin: [
    {
      required: true,
      message: "Password is required",
    },
  ],

  name: [
    { required: true, message: "Name is required" },
    { max: 40, message: "Name must be at most 40 characters long" },
    { min: 3, message: "Name must be at least 3 characters long" },
    {
      pattern: /^[A-Za-z\s]+$/,
      message: "Name must contain only alphabetic characters",
    },
  ],

  title: [
    { required: true, message: "Title is required" },
    { max: 40, message: "Title must be at most 40 characters long" },
    { min: 1, message: "Title must be at least 1 characters long" },
  ],

  comment: [
    { required: true, message: "Comment is required" },
    { max: 40, message: "comment must be at most 40 characters long" },
    { min: 1, message: "comment must be at least 1 characters long" },
  ],

  descrption: [
    { required: true, message: "Content is required" },
    { max: 200, message: "Content must be at most 200 characters long" },
    { min: 1, message: "Content must be at least 1 characters long" },
  ],
};
