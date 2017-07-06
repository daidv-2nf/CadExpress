import {Request, Response} from "express";
import {Language} from "../common/languages";
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {

  res.render("home", {
    title: "Home"
  });
};

