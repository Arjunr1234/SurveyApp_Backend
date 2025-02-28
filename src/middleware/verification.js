import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15m" });
};

export const verification = (role) => {
  return (req, res, next) => {
    try {
      const userToken = req.cookies.userAccessToken;
      const adminToken = req.cookies.adminAccessToken;
      const userRefreshToken = req.cookies.userRefreshToken;
      const adminRefreshToken = req.cookies.adminRefreshToken;
     console.log("Enter into verification role: ", role)
      let token = null;
      let refreshToken = null;

      if (role === "admin") {
        token = adminToken;
        refreshToken = adminRefreshToken;
      } else if (role === "user") {
        token = userToken;
        refreshToken = userRefreshToken;
      }

      

      jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) {
          console.log("This is refesHtoken: ",refreshToken)
          if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
          }
          console.log("Thsi is before jwt token verify")
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (refreshErr, refreshDecoded) => {
            if (refreshErr) {
              return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
            }

            
            const newAccessToken = generateAccessToken({ id: refreshDecoded.id, role: refreshDecoded.role });

            
            res.cookie(role === "admin" ? "adminAccessToken" : "userAccessToken", newAccessToken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              maxAge: 15 * 60 * 1000, 
            });

            req.user = refreshDecoded; 
            next();
          });
        } else if (err) {
            console.log("This is err: ", err)
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        } else {
          
          if (decoded.role !== role) {
            return res.status(403).json({ message: "Forbidden: You do not have access" });
          }

          req.user = decoded; 
          next();
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};


