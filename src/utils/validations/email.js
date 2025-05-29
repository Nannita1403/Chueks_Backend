
const verifyEmail = (email) => {
   const validated= RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email);

   console.log(validated);
   
};

module.exports = {verifyEmail};