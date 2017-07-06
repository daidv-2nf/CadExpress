import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { Language } from "../common/languages";

/**
 * GET /index
 * Login page.
 */
export let getIndex = (req: Request, res: Response) => {
  const language = new Language(req);
  language.__("abc");
  if (req.user) {
    return res.redirect("/");
  }
  res.json();
};