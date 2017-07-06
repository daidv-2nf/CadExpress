
import { Request, Response } from "express";
export class Language {
    private lang_data: any;
    private _language: string = "en_US";
    constructor(req: Request) {
        if (req.cookies.language != undefined) {
            this._language = req.cookies.language;
            this._language = this._language.replace("-", "_");
        }
        this.lang_data = require("../public/languages/" + this._language + ".json");
    }

    public __ = (text: string): string => {
       return this.lang_data[text];
    }
}