import type { Request, Response } from "express";
import { signupPayloadModel, singInPayloadModel } from "./models.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "node:crypto";
import { createUserToken, verifyUserToken } from "./utils/token.js";

class AuthenticationController {
  // sign up a user
  public async handleSignUp(req: Request, res: Response) {
    const validationResult = await signupPayloadModel.safeParseAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        message: "Body validation failed",
        error: validationResult.error.issues,
      });
    }

    const { firstName, lastName, email, password } = validationResult.data;
    const userEmailResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (userEmailResult.length > 0) {
      return res.status(400).json({
        message: `User with email ${email} already exist. `,
        error: "Duplicate Entry",
      });
    }
    // get some random stings
    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const [result] = await db
      .insert(usersTable)
      .values({
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id });

    return res.status(201).json({
      message: "User has been created. ",
      data: { id: result?.id },
    });
  }

  public async handleSingIn(req: Request, res: Response) {
    const validationResult = await singInPayloadModel.safeParseAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        message: "Body validation failed",
        error: validationResult.error.issues,
      });
    }

    const { email, password } = validationResult.data;
    const [userSelect] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!userSelect) {
      return res.status(404).json({
        message: `user with email ${email} does not exist`,
      });
    }
    // if user exist then we have to verify the hash
    // get the salt from the db
    const salt = userSelect.salt!;
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    if (userSelect.password !== hash) {
      return res.status(400).json({
        message: "User email or password is incorrect",
      });
    }
    // if user password matched create token
    const token = createUserToken({ id: userSelect.id });

    return res.json({
      message: "Sign in success",
      data: { token: token },
    });
  }
}

export default AuthenticationController;
