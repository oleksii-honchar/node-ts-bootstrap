import { Router } from "express";

import { userController } from "@src/controllers/userController";
import { authMiddleware } from "@src/utils/middlewares";

export const userRouter = Router();

userRouter.get("/users", authMiddleware, userController.listAllUsers);
userRouter.get("/users/:userId", authMiddleware, userController.readUser);

userRouter.get("/users/by-email/:userEmail", authMiddleware, userController.readUserByEmail);
userRouter.delete("/users", authMiddleware, userController.deleteUsers);
userRouter.delete("/users/:userId", authMiddleware, userController.deleteUser);

userRouter.post("/users/register", userController.register);
userRouter.post("/users/verify-email/send-confirmation", userController.sendEmailConfirmationRequest);
userRouter.post("/users/verify-email", userController.verifyEmail);
userRouter.post("/users/reset-password/send-confirmation", userController.sendResetPasswordRequest);
userRouter.post("/users/reset-password/validate-token", userController.validateResetPasswordToken);
userRouter.post("/users/reset-password", userController.resetPassword);
userRouter.post("/users/authenticate", userController.authenticate);
userRouter.post("/users/authenticate/validate-token", authMiddleware, userController.validateAuthToken);
userRouter.post("/users/authenticate/remove-token", authMiddleware, userController.removeAuthToken);
