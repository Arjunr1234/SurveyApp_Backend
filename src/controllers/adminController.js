import {
  adminSignInService,
  getFormDataService,
} from "../services/adminService.js";
import { HttpStatusCode } from "../utils/statusCodes.js";

export const adminSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: "Please provide all data" });
      return;
    }
    const response = await adminSignInService(email, password);
    console.log("This is response; ", response);

    if (!response.success) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: response.message,
      });
    }

    res.cookie("adminAccessToken", response.accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("adminRefreshToken", response.refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: response.message,
      userId: response.userId,
    });
  } catch (error) {
    console.log("Error in adminSignIN: ", error);
    next(error);
  }
};

export const getFormData = async (req, res, next) => {
  try {
    const response = await getFormDataService();
    console.log("This is the adminReposn: ", response)

    if (!response.success) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: response.success, message: response.message });
    }
    res
      .status(HttpStatusCode.OK)
      .json({
        success: response.success,
        message: response.message,
        formData: response.formData,
      });
  } catch (error) {
    console.log("Error in getFormData: ", error);
    next(error);
  }
};

export const logout = (req, res, next) => {
  
  res.clearCookie("adminAccessToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false, 
  });

  
  res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,  
  });

  
  res.status(HttpStatusCode.OK).json({ success:true, message: "Logged out successfully" });
};

