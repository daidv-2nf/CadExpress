import {Base} from "./lib/base";

class Login extends Base.Common {
    constructor() {
        super();
        console.log(this.lang.__("abc"));
    }
}

$(document).ready(function() {
    const login = new Login();
});