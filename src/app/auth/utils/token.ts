import jwt from "jsonwebtoken";

interface UserTokenPayload {
  id: string;
}

const JWT_SECRET = "chaicodesecret";

export const createUserToken = (payload: UserTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyUserToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
};
