// export const generateToken = (user, message, statusCode, res) =>{
//       const token = user.generateJsonWebToken();
//       const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
//       res.status(statusCode).cookie(cookieName, token, {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//       }).json({
//          success: true,
//          message,
//          user,
//          token,
//       });

     
// }

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  // Convert to Number and provide a fallback (e.g., 7 days)
  const expiresDays = Number(process.env.JWT_COOKIE_EXPIRES) || 7;

  res.status(statusCode).cookie(cookieName, token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + expiresDays * 24 * 60 * 60 * 1000
    ),
  }).json({
    success: true,
    message,
    user,
    token,
  });
};
