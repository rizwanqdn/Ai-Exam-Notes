import User from "../models/user.model.js";
import { getToken } from "../utils/token.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }
    let token = await getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
<<<<<<< HEAD
      path: "/",
=======
      path:"/",
>>>>>>> 65f6193ed2e7435745b437ded8ca22741b02f153
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token: token, // <--- THIS IS CRUCIAL FOR MOBILE
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: `error ${error}` });
  }
};
export const logOut = async (req, res) => {
  try {
    // 1. Use res.clearCookie to remove the token from the browser
    // The options (httpOnly, sameSite) should match how the cookie was created
    res.clearCookie("token", {
<<<<<<< HEAD
      httpOnly: true,
      secure: true, // Matched with googleAuth
      sameSite: "none", // Matched with googleAuth
=======
     httpOnly: true,
      secure: true,       // Matched with googleAuth
      sameSite: "none",   // Matched with googleAuth
>>>>>>> 65f6193ed2e7435745b437ded8ca22741b02f153
      path: "/",
    });

    // 2. Send the response back to the client
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    // 3. Catch errors and use error.message for cleaner logs
    return res
      .status(500)
      .json({ message: `Error occurred: ${error.message}` });
  }
};
