import {Common, } from "./lib/base";
class Dbc extends Base.Common {
    constructor() {
        super();
        console.log(this.lang.__("abc"));
    }
}

$(document).ready(function() {
  // Place JavaScript code here...
  const a = new Dbc();
});