const layout = require("../layout");

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (error) {
    return "";
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
    <div>
    Your ID is ${req.session.userId}
      <form method="POST">
      <input name="email" placeholder="email"/>
      ${getError(errors, "email")}
      <input name="password" placeholder="password"/>
      ${getError(errors, "password")}
      <input name="password2" placeholder="confirm password"/>
      ${getError(errors, "password2")}
      <button>Sign Up</button>
      </form>
    </div>
    `,
  });
};
