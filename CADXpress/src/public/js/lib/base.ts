import {Converter} from "./converter";
/**
 * Common Base
 */
export namespace Base {

    /**
     * This class contains common functions
     * Extend this to init Language And Validation
     */
    export class Common {
        public lang: Language;
        
        public validation: Validation;

        /**
         * Constructor
         */
        constructor() {
            let language = this.getCookie("language");
            if (language == "" || language == null) {
                language = "en_US";
            }
            this.lang = new Language(language);
            this.validation = new Validation(this.lang);
        };

        /**
         * getCookie
         * Params:
         * name:string name of cookie
         * Return string
         */
        public getCookie = (name: string): string => {
            const nameLenPlus = (name.length + 1);
            return document.cookie
                .split(';')
                .map(c => c.trim())
                .filter(cookie => {
                    return cookie.substring(0, nameLenPlus) === `${name}=`;
                })
                .map(cookie => {
                    return decodeURIComponent(cookie.substring(nameLenPlus));
                })[0] || null;
        }

        /**
         * 
         */
        public setCookie = (name: string, value: string, days?: number) => {
            if (!days) {
                days = 365 * 20;
            }

            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

            var expires = "; expires=" + date.toUTCString();

            document.cookie = name + "=" + value + expires + "; path=/";
        }

        public delCookie = (name: string) => {
            this.setCookie(name, "", -1);
        }
    }
    class Language {
        private _lang_data: any;
        private _language: string = "en_US";
        constructor(language: string) {
            if (language != '') {
                this._language = language.replace("-", "_");
            }
            let ithis = this;
            $.ajax({
                type: "GET",
                url: "/languages/" + language + ".json",
                dataType: 'json',
                success: function (data) {
                    ithis._lang_data = data;
                },
                data: {},
                async: false
            });
            console.log("asyn");
        }
        public __ = (text: string, ...params): string => {
            let translated: string = this._lang_data[text];
            for (var i = 0; i < params.length; i++) {
                translated = translated.replace("%" + (i + 1).toString(), params[i]);
            }
            return this._lang_data[text];
        }
    }
    /**
     * Class Validation
     * Usage: Use these attributes to validate fields
     * - validation: Object is form. Add this to validate form
     * - fullwidth: Object are text, textarea. Add this to validate field is fullwidth
     * - not-fullwidth: Object are text, textarea, number. Add this to validate field is not fullwidth
     * - gte: Object are text, number. Value is number. Add this to validate field if value of field greater than or equal to number
     * - gt: Object are text, number. Value is number. Add this to validate field if value of field greater than number
     * - lte: Object are text, number. Value is number. Add this to validate field if value of field less than or equal to number
     * - lt: Object are text, number. Value is number. Add this to validate field if value of field less than number
     * - maxlength: Object are text, number, textarea
     * - minlength: Object are text, number, textarea
     * - between: Object are text, number. Value has format \d,\d
     * - max: Object are text, number. Value has format \d
     * - min: Object are text, number. Value has format \d
     * - number: Object are text, number. Value has format \d
     * - decimal: Object are text, number. Value has format \d
     */
    class Validation {
        private _lang: Language;

        private _opt: {
            error_element_class: "error",
            error_message_class: "error-message",
            invisible_element_class: "none"
        }
        constructor(language: Language) {
            this._lang = language;
            $("form[validation]");
        }

        validate_fullwidth = (validation: IValidation) => {
            var param = {
                type: 'fullwidth',
                msg: false
            };
            var regex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/;
            if (regex.test(validation.$obj.val())) {
                if (validation.trigger_ok) {
                    validation.$obj.tmp = validation.trigger_ok;
                    validation.$obj.tmp(param);
                    validation.$obj.tmp = undefined;
                } else {
                    var msg = validation.$obj.parent().find('.error-message.fullwidth');
                    if (msg.length > 0) {
                        msg.remove();
                        validation.$obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (validation.trigger_error) {
                    validation.$obj.tmp = validation.trigger_error;
                    validation.$obj.tmp(param);
                    validation.$obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = validation.$obj.parent().find('.error-message.fullwidth');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message fullwidth none">' + this._lang.__('ERROR_FULLWIDTH', validation.$obj.attr('maxlength')) + '</div>');
                            $er.insertAfter(validation.$obj);
                            if (validation.post != true) {
                                $er.slideDown();
                            }
                            validation.$obj.addClass('error');
                        }
                    }
                } else {
                    var msg = validation.$obj.parent().find('.error-message.fullwidth');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message fullwidth none">' + this._lang.__('ERROR_FULLWIDTH', validation.$obj.attr('maxlength')) + '</div>');
                        $er.insertAfter(validation.$obj);
                        if (validation.post != true) {
                            $er.slideDown();
                        }
                        validation.$obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_isNotFullwidth = ($obj, trigger_ok, trigger_error, post) => {
            var param = {
                type: 'notfullwidth',
                msg: false
            };
            var fullw = [
                0x30A1, 0x30A2, 0x30A3, 0x30A4, 0x30A5, 0x30A6, 0x30A7, 0x30A8,
                0x30A9, 0x30AA, 0x30AB, 0x30AD, 0x30AF, 0x30B1, 0x30B3, 0x30B5,
                0x30B7, 0x30B9, 0x30BB, 0x30BD, 0x30BF, 0x30C1, 0x30C3, 0x30C4,
                0x30C6, 0x30CA, 0x30CB, 0x30CC, 0x30CD, 0x30CE, 0x30CF, 0x30D2,
                0x30D5, 0x30D8, 0x30DB, 0x30DE, 0x30DF, 0x30E0, 0x30E1, 0x30E2,
                0x30E3, 0x30E4, 0x30E5, 0x30E6, 0x30E7, 0x30E8, 0x30E9, 0x30EA,
                0x30EB, 0x30EC, 0x30ED, 0x30EE, 0x30EF, 0x30F2, 0x30F3, 0x30F5,
                0x30F6,
            ];
            var fullws1 = [
                0x30ac, 0x30ae, 0x30B0, 0x30B2, 0x30B4, 0x30B6, 0x30B8, 0x30BA,
                0x30BC, 0x30BE, 0x30C0, 0x30C2, 0x30C5, 0x30C7, 0x30C9, 0x30D0,
                0x30D3, 0x30D6, 0x30D9, 0x30DC, 0x30F4, 0x30F7, 0x30f4
            ];
            var fullws2 = [
                0x30D1, 0x30D4, 0x30D7, 0x30DA, 0x30DD
            ];
            var isFull = false;
            var chars = $obj.val();
            for (var i = 0; i < chars.length; i++) {
                var c = chars[i].charCodeAt(0);
                if (c >= 0xff00 && c <= 0xff5e) {
                    isFull = true;
                    break;
                } else {
                    if (fullw.indexOf(c) != -1 || fullws1.indexOf(c) != -1 || fullws2.indexOf(c) != -1) {
                        isFull = true;
                        break;
                    }
                }
            }
            if (!isFull) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.notfullwidth');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.notfullwidth');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message notfullwidth none">' + this._lang.__('ERROR_NOTFULLWIDTH') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.notfullwidth');
                    if (msg.length == 0) {
                        $obj.parent().find('.error-message').remove();
                        var $er = $('<div class="error-message notfullwidth none">' + this._lang.__('ERROR_NOTFULLWIDTH') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_great_than_equal = ($obj, trigger_ok, trigger_error, post) => {
            var $gte_obj = $('#' + $obj.attr('gte'));
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            // $gte_obj.val(Converter.toASCII($gte_obj.val()));
            var param = {
                type: 'gte',
                msg: false
            };
            var val = $obj.val().trim();
            var gteval = $gte_obj.val().trim();

            if (val != '' && gteval != '' && (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) &&
                (parseInt(gteval).toString().length == gteval.length || parseFloat(gteval).toString().length == gteval.length) && parseInt(val) >= -1 && parseInt(gteval) >= -1 && parseInt(val) >= parseInt(gteval)) {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.gte');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message gte none">' + this._lang.__('ERROR_GTE', gteval) + '</div>');
                            $er.insertAfter($obj);
                            //if (post != true) {
                            //  $er.slideDown();
                            //}
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.gte');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message gte none">' + this._lang.__('ERROR_GTE', gteval) + '</div>');
                        $er.insertAfter($obj);
                        //if (post != true) {
                        //  $er.slideDown();
                        //}
                        $obj.addClass('error');
                    } else {
                        msg.remove();
                        var $er = $('<div class="error-message gte none">' + this._lang.__('ERROR_GTE', gteval) + '</div>');
                        $er.insertAfter($obj);
                        // $gte_obj.trigger('blur');
                    }
                }
                return false;
            } else {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.gte');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            }

        };

        validate_less_than_equal = ($obj, trigger_ok, trigger_error, post) => {
            var $lte_obj = $('#' + $obj.attr('lte'));
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            // $lte_obj.val(Converter.toASCII($lte_obj.val()));
            var param = {
                type: 'lte',
                msg: false
            };
            var val = $obj.val().trim();
            var lteval = $lte_obj.val().trim();
            if (val != '' && lteval != '' && (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) &&
                (parseInt(lteval).toString().length == lteval.length || parseFloat(lteval).toString().length == lteval.length) && parseInt(val) >= -1 && parseInt(lteval) >= -1 && parseInt(val) <= parseInt(lteval)) {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.lte');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message lte none">' + this._lang.__('ERROR_LTE', lteval) + '</div>');
                            $er.insertAfter($obj);
                            //if (post != true) {
                            //  $er.slideDown();
                            //}
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.lte');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message lte none">' + this._lang.__('ERROR_LTE', lteval) + '</div>');
                        $er.insertAfter($obj);
                        //if (post != true) {
                        //  $er.slideDown();
                        //}
                        $obj.addClass('error');
                    } else {
                        msg.remove();
                        var $er = $('<div class="error-message lte none">' + this._lang.__('ERROR_GTE', lteval) + '</div>');
                        $er.insertAfter($obj);
                    }
                }
                return false;
            } else {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.lte');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            }

        };

        validate_great_than = ($obj, trigger_ok, trigger_error, post) => {
            var $gt_obj = $('#' + $obj.attr('gt'));
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            // $gt_obj.val(Converter.toASCII($gt_obj.val()));
            var param = {
                type: 'gt',
                msg: false
            };
            var val = $obj.val().trim();
            var gtval = $gt_obj.val().trim();
            if (val != '' && gtval != '' && (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) &&
                (parseInt(gtval).toString().length == gtval.length || parseFloat(gtval).toString().length == gtval.length) && parseInt(val) >= -1 && parseInt(gtval) >= -1 && parseInt(val) > parseInt(gtval)) {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.gt');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message gt none">' + this._lang.__('ERROR_GT', gtval) + '</div>');
                            $er.insertAfter($obj);
                            //if (post != true) {
                            //  $er.slideDown();
                            //}
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.gt');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message gt none">' + this._lang.__('ERROR_GT', gtval) + '</div>');
                        $er.insertAfter($obj);
                        //if (post != true) {
                        //  $er.slideDown();
                        //}
                        $obj.addClass('error');
                    }
                }
                return false;
            } else {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.gt');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            }
        };

        validate_less_than = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            // $lt_obj.val(Converter.toASCII($lt_obj.val()));
            var param = {
                type: 'lt',
                msg: false
            };
            var $lt_obj = $('#' + $obj.attr('lt'));
            var val = $obj.val().trim();
            var ltval = $lt_obj.val().trim();
            if (val != '' && ltval != '' && (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) &&
                (parseInt(ltval).toString().length == ltval.length || parseFloat(ltval).toString().length == ltval.length) && parseInt(val) >= -1 && parseInt(ltval) >= -1 && parseInt(val) < parseInt(ltval)) {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.lt');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message lt none">' + this._lang.__('ERROR_LT', ltval) + '</div>');
                            $er.insertAfter($obj);
                            //if (post != true) {
                            //  $er.slideDown();
                            //}
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.lt');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message lt none">' + this._lang.__('ERROR_LT', ltval) + '</div>');
                        $er.insertAfter($obj);
                        //if (post != true) {
                        //  $er.slideDown();
                        //}
                        $obj.addClass('error');
                    }
                }
                return false;
            } else {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.lt');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            }
        };

        validate_equal = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            // $lt_obj.val(Converter.toASCII($lt_obj.val()));
            var param = {
                type: 'eq',
                msg: false
            };
            var $lt_obj = $('#' + $obj.attr(param.type));
            var val = $obj.val().trim();
            var ltval = $lt_obj.val().trim();
            var condition = val != '' &&
             ltval != '' &&
              (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) &&
              (parseInt(ltval).toString().length == ltval.length || parseFloat(ltval).toString().length == ltval.length) &&
               parseInt(val) >= -1 && 
               parseInt(ltval) >= -1 && 
               parseInt(val) != parseInt(ltval);
            return this.setMsg(condition, trigger_error, trigger_ok, $obj, !post, ltval);
        };

        setMsg = (condition_true, trigger_error, trigger_ok,
            $obj, param, slideDown, ...value): boolean => {
           if (!condition_true) {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find(`.${this._opt.error_message_class}.${param.type}`);
                        if (msg.length == 0) {
                            var $er = $(`<div class="${this._opt.error_message_class} ${param.type} ${this._opt.invisible_element_class}">` + this._lang.__('ERROR_' + param.type.toUpperCase, value) + '</div>');
                            $er.insertAfter($obj);
                            if (slideDown) {
                             $er.slideDown();
                            }
                            $obj.addClass(this._opt.error_element_class);
                        }
                    }
                } else {
                    var msg = $obj.parent().find(`.${this._opt.error_message_class}.${param.type}`);
                    if (msg.length == 0) {
                        var $er = $(`<div class="${this._opt.error_message_class} ${param.type} ${this._opt.invisible_element_class}">` + this._lang.__('ERROR_' + param.type.toUpperCase, value) + '</div>');
                        $er.insertAfter($obj);
                        if (slideDown) {
                         $er.slideDown();
                        }
                        $obj.addClass(this._opt.error_element_class);
                    }
                }
                return false;
            } else {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find(`.${this._opt.error_message_class}.${param.type}`);
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass(this._opt.error_element_class);
                    }
                }
                return true;
            }
        };

        validate_max_length = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // hungnh comment 20160822
            //$obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'maxlength',
                msg: false
            };
            if ($obj.attr('maxlength') >= $obj.val().length) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.maxlength');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.maxlength');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message maxlength none">' + this._lang.__('ERROR_MAX_LENGTH', $obj.attr('maxlength')) + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.maxlength');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message maxlength none">' + this._lang.__('ERROR_MAX_LENGTH', $obj.attr('maxlength')) + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_min_length = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'minlength',
                msg: false
            };
            var val = $obj.val().trim();
            if (val == '' || (val != '' && $obj.attr('minlength') <= val.length)) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.minlength');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }

                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp('minlength');
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.minlength');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message minlength none">' + this._lang.__('ERROR_MIN_LENGTH', $obj.attr('minlength')) + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.minlength');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message minlength none">' + this._lang.__('ERROR_MIN_LENGTH', $obj.attr('minlength')) + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_between = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'between',
                msg: false
            };
            var val = $obj.val().trim();
            if (val == '' || (val != '' && $obj.attr('between') <= val.length)) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.between');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }

                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp('between');
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.between');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message between none">' + this._lang.__('ERROR_BETWEEN', $obj.attr('between')) + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.between');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message between none">' + this._lang.__('ERROR_BETWEEN', $obj.attr('between')) + '</div>');
                        $er.insertAfter($obj);
                        $('#password').on('blur', function () {
                            if (post != true) {
                                $er.slideDown();
                            }
                        });
                        // if(post != true) {
                        //   $er.slideDown();
                        // }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_max = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'max',
                msg: false
            };
            var val = $obj.val().trim();
            if (val.length > 0) {
                if (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) {
                    if (parseInt($obj.attr('max')) >= parseInt(val)) {
                        if (trigger_ok) {
                            $obj.tmp = trigger_ok;
                            $obj.tmp(param);
                            $obj.tmp = undefined;
                        } else {
                            var msg = $obj.parent().find('.error-message.max');
                            if (msg.length > 0) {
                                msg.remove();
                                $obj.removeClass('error');
                            }
                        }
                        return true;
                    } else {
                        if (trigger_error) {
                            $obj.tmp = trigger_error;
                            $obj.tmp(param);
                            $obj.tmp = undefined;
                            if (param.msg === true) {
                                var msg = $obj.parent().find('.error-message.max');
                                if (msg.length == 0) {
                                    var $er = $('<div class="error-message max none max-remove">' + this._lang.__('ERROR_MAX_VALUE', $obj.attr('max')) + '</div>');
                                    $er.insertAfter($obj);
                                    //if(post != true) {
                                    //  $er.slideDown();
                                    //}
                                    $obj.addClass('error');
                                }
                            }
                        } else {
                            var msg = $obj.parent().find('.error-message.max');
                            if (msg.length == 0) {
                                var $er = $('<div class="error-message max none max-remove">' + this._lang.__('ERROR_MAX_VALUE', $obj.attr('max')) + '</div>');
                                $er.insertAfter($obj);
                                //if(post != true) {
                                //  $er.slideDown();
                                //}
                                $obj.addClass('error');
                            }
                            return false;
                        }
                        return false;
                    }
                }
            } else {
                $('.max-remove').remove();
                $obj.removeClass('error');
                $obj.removeClass('error_max');
                // $obj.val(-1);
            }
        };

        validate_min = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'min',
                msg: false
            };
            var val = $obj.val().trim();

            //Hung DQ input empty
            if (isNaN(parseInt($obj.val()))) {
                var msg = $obj.parent().find('.error-message.min');
                msg.remove();
            }

            if (parseInt(val).toString().length == val.length || parseFloat(val).toString().length == val.length) {
                if (parseInt($obj.attr('min')) <= parseInt($obj.val()) || $obj.parent().find('.error-message.required').length > 0) {
                    if (trigger_ok) {
                        $obj.tmp = trigger_ok;
                        $obj.tmp(param);
                        $obj.tmp = undefined;
                    } else {
                        var msg = $obj.parent().find('.error-message.min');
                        if (msg.length > 0) {
                            msg.remove();
                            $obj.removeClass('error');
                        }
                    }
                    return true;
                } else {
                    if (trigger_error) {
                        $obj.tmp = trigger_error;
                        $obj.tmp(param);
                        $obj.tmp = undefined;
                        if (param.msg === true) {
                            var msg = $obj.parent().find('.error-message.min');
                            if (msg.length == 0) {
                                var $er = $('<div class="error-message min none">' + this._lang.__('ERROR_MIN_VALUE', $obj.attr('min')) + '</div>');
                                $er.insertAfter($obj);
                                //if(post != true) {
                                //  $er.slideDown();
                                //}
                                $obj.addClass('error');
                            }
                        }
                    } else {
                        var msg = $obj.parent().find('.error-message.min');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message min none">' + this._lang.__('ERROR_MIN_VALUE', $obj.attr('min')) + '</div>');
                            $er.insertAfter($obj);
                            //if(post != true) {
                            //  $er.slideDown();
                            //}
                            $obj.addClass('error');
                        }
                    }
                    return false;
                }
            }
        };

        validate_number = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'number',
                msg: false
            };
            var val = $obj.val().trim();
            if (val == '' || (val != '' && !isNaN(parseInt(val)) && parseInt(val).toString().length == val.length)) { //is_int
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.number');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_NUMBER_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_NUMBER_FORMAT') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_decimal = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));

            //convert to "."
            var val0 = $obj.val().replace(/\。/g, '.'),
                val1 = val0.replace(/\．/g, '.'),
                val2 = val1.replace(/\｡/g, '.'),
                numDot = val2.split(".").length - 1;
            if ($obj.val().trim() != '') {
                $obj.val(numDot > 1 ? 0 : parseFloat(val2));
            }
            if ($.isNumeric($obj.val()) == false) {
                $obj.val(0);
            }

            var param = {
                type: 'decimal',
                msg: false
            };
            var val = $obj.val().trim();
            var str = "";
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == '.' || arr[i] == ',') {
                    for (var j = (val.length - 1); j >= i; j--) {
                        if (arr[j] == 0) {
                            arr[j] = '';
                        } else {
                            break;
                        }
                    }
                }
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != '') {
                    str += arr[i];
                } else {
                    break;
                }
            }

            if (str.substring(str.length - 1, str.length) == '.'
                || str.substring(str.length - 1, str.length) == ','
            ) {
                str = str.substring(0, str.length - 2)
            }
            val = str;
            if (val == ''
                || (val != '' && parseFloat(val).toString().length == val.length)
                && Number(val).toString().length == val.length
            ) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.decimal');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.decimal');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message decimal none">' + this._lang.__('ERROR_DECIMAL_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.decimal');
                    if (msg.length == 0) {
                        //        var $er = $('<div class="error-message decimal none">' + this._lang.__('ERROR_DECIMAL_FORMAT') + '</div>');
                        //        $er.insertAfter($obj);
                        //        if(post != true) {
                        //          $er.slideDown();
                        //        }
                        //        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_email = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'email',
                msg: false
            };
            var regex = /^([-a-z0-9}{\'?]+(_[-a-z0-9}{\'?]+|\.[-a-z0-9}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?)?$/i;//regex all val

            var regex2 = /^(@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?)?$/i;//regex after @

            var regex1_special = /[!"#$€₤£¥%&'()*+,\/:;<=>?@[\\\]^`{|}~]/g;//regex before @

            var val = $obj.val().trim();
            var n = val.indexOf("@");       //location of @
            var res = val.substring(0, n);  //char before @
            var res2 = val.substring(n);    //char after @

            if ((val != '') && (val.indexOf("@") == -1)) {//not @
                var msg1 = $obj.parent().find('.error-message.email1');
                if (msg1.length == 0) {
                    var $er = $('<div class="error-message email1 none">' + this._lang.__('ERROR_EMAIL_FORMAT@') + '</div>');
                    $er.insertAfter($obj);
                    if (post != true) {
                        $er.slideDown();
                    }
                    $obj.addClass('error');
                }
                var msg = $obj.parent().find('.error-message.email');
                if (msg.length > 0) {
                    msg.remove();
                }
                var msg2 = $obj.parent().find('.error-message.email2');
                if (msg2.length > 0) {
                    msg2.remove();
                }
                return false;
            }
            if (val === ''
                || (val != '' && regex.test(val))
            ) {//regex = true
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.email');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                    var msg1 = $obj.parent().find('.error-message.email1');
                    if (msg1.length > 0) {
                        msg1.remove();
                        $obj.removeClass('error');
                    }
                    var msg2 = $obj.parent().find('.error-message.email2');
                    if (msg2.length > 0) {
                        msg2.remove();
                        $obj.removeClass('error');
                    }
                    var msg3 = $obj.parent().find('.error-message.isExist');
                    if (msg3.length > 0) {
                        $obj.addClass('error');
                    }
                }
                return true;
            } else {//regex = false
                if (val != ''
                    && regex2.test(res2)
                    && n > 0
                    && regex1_special.test(res) == false
                ) {//regex1_special = false (full-half)
                    var msg2 = $obj.parent().find('.error-message.email2');
                    if (msg2.length == 0) {
                        var $er = $('<div class="error-message email2 none">' + this._lang.__('ERROR_EMAIL_ALPHANUMERIC') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                    var msg = $obj.parent().find('.error-message.email');
                    if (msg.length > 0) {
                        msg.remove();
                    }
                    var msg1 = $obj.parent().find('.error-message.email1');
                    if (msg1.length > 0) {
                        msg1.remove();
                    }
                    return false;
                }//end regex1_special

                var msg = $obj.parent().find('.error-message.email');
                if (msg.length == 0) {
                    var $er = $('<div style="z-index: 1000" class="error-message email none">' + this._lang.__('ERROR_EMAIL_FORMAT') + '</div>');
                    $er.insertAfter($obj);
                    if (post != true) {
                        $er.slideDown();
                    }
                    $obj.addClass('error');
                }
                var msg1 = $obj.parent().find('.error-message.email1');
                if (msg1.length > 0) {
                    msg1.remove();
                }
                var msg2 = $obj.parent().find('.error-message.email2');
                if (msg2.length > 0) {
                    msg2.remove();
                }
                return false;
            }
        };

        validate_alpha = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'email',
                msg: false
            };
            var regex = /^[a-zA-Z0-9-_]{1,}$/i;
            var val = $obj.val().trim();
            if ((val != '' && regex.test(val)) || val == '') {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else if (val != '') {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.number');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_ALPHA') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_ALPHA') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_alpha_word = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'email',
                msg: false
            };
            var regex = /^[a-zA-Z]{1,}$/i;
            var val = $obj.val().trim();
            if ((val != '' && regex.test(val)) || val == '') {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else if (val != '') {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.number');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_ALPHA_WORD') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.number');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message number none">' + this._lang.__('ERROR_ALPHA_WORD') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_tel = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'tel',
                msg: false
            };
            var line_regex1 = /^0{1}(((([0-9]{1}-[0-9]{4})|([0-9]{2}-([0-9]{3}|[0-9]{4})))-[0-9]{4}$)|([0-9]{9}$))/;
            var val = $obj.val().trim();
            if (val === '' || (val !== '' && line_regex1.test(val))) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.tel');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.tel');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message tel none">' + this._lang.__('ERROR_PHONE_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.tel');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message tel none">' + this._lang.__('ERROR_PHONE_FORMAT') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                }
                return false;
            }
        };

        validate_required = ($obj, trigger_ok, trigger_error, post) => {
            var param = {
                type: 'required',
                msg: false
            };
            if ($obj.val().trim() !== '') {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    //remove msg & class required
                    var msg = $obj.parent().find('.error-message.required');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }

                    //add class specialChar
                    var msg3 = $obj.parent().find('.error-message.specialChar');
                    if (msg3.length > 0) {
                        $obj.addClass('error');
                        return false;
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.required');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message required none">' + this._lang.__('ERROR_REQUIRED') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                        }
                        $obj.addClass('error');
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.required');
                    if (msg.length == 0) {
                        $obj.parent().find('.error-message').remove();
                        var $er = $('<div class="error-message required none">' + this._lang.__('ERROR_REQUIRED') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                    }
                    $obj.addClass('error');
                }
                return false;
            }
        };

        validate_confirm_email = ($obj, mail_address, trigger_ok, trigger_error, post) => {

            var param = {
                type: 'confirm_email',
                msg: false
            };
            if ($obj.val().trim() !== '' && $obj.val() == mail_address) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.confirm');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.confirm');
                        if (msg.length == 0) {
                            var msg1 = $obj.parent().find('.error-message');
                            if (msg1.length > 0) {
                                msg1.remove();
                            }
                            var $er = $('<div class="error-message confirm none">' + this._lang.__('ERROR_CONFIRM_MAIL') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                        }
                        $obj.addClass('error');
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.confirm');
                    if (msg.length == 0) {
                        var msg1 = $obj.parent().find('.error-message');
                        if (msg1.length > 0) {
                            msg1.remove();
                        }
                        var $er = $('<div class="error-message confirm none">' + this._lang.__('ERROR_CONFIRM_MAIL') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                    }
                    $obj.addClass('error');
                }
                return false;
            }
        };

        validate_confirm_password = ($obj, password, trigger_ok, trigger_error, post) => {

            var param = {
                type: 'confirm_password',
                msg: false
            };
            if ($obj.val() != '' && $obj.val() == password) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.required');

                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }

                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.required');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message required none">' + this._lang.__('ERROR_CONFIRM_PW') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                        }
                        $obj.addClass('error');
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.required');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message required none">' + this._lang.__('ERROR_CONFIRM_PW') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                    }
                    $obj.addClass('error');
                }
                return false;
            }
        };

        validate_date = ($obj, trigger_ok, trigger_error, post) => {
            if ($obj.val() != '') {
                var valid = true;
                // STRING FORMAT yyyy-mm-dd
                if ($obj.val() == "" || $obj.val() == null) {
                    valid = false;
                }

                // m[1] is year 'YYYY' * m[2] is month 'MM' * m[3] is day 'DD'
                var m = $obj.val().match(/(\d{4})-(\d{2})-(\d{2})/);

                // STR IS NOT FIT m IS NOT OBJECT
                if (m === null || typeof m !== 'object') {
                    valid = false;
                }

                // CHECK m TYPE
                if (typeof m !== 'object' && m !== null && m.size !== 3) {
                    valid = false;
                }

                var maxYear = 2050; //YEAR NOW
                var minYear = 1900; //MIN YEAR

                // YEAR CHECK
                if ((m[1].length < 4) || m[1] < minYear || m[1] > maxYear) {
                    valid = false;
                }
                // MONTH CHECK
                if ((m[2].length < 2) || m[2] < 1 || m[2] > 12) {
                    valid = false;
                }
                // DAY CHECK
                if ((m[3].length < 2) || m[3] < 1 || m[3] > 31) {
                    valid = false;
                }

                if (valid == true) {
                    if (trigger_ok) {
                        $obj.tmp = trigger_ok;
                        $obj.tmp();
                        $obj.tmp = undefined;
                    } else {
                        var msg = $obj.parent().find('.error-message.format');
                        if (msg.length > 0) {
                            msg.remove();
                            $obj.removeClass('error');
                        }
                    }
                } else {
                    if (trigger_error) {
                        $obj.tmp = trigger_error;
                        $obj.tmp('date');
                        $obj.tmp = undefined;
                    } else {
                        var msg = $obj.parent().find('.error-message.format');
                        if (msg.length == 0) {
                            $('<div class="error-message format"></div>').insertAfter($obj);
                            $obj.addClass('error');
                        }
                    }
                }
            }
        };

        validate_postal_code = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'postal_code',
                msg: false
            };
            var postal_code_regex = /^\d+$/;
            var val = $obj.val().trim();
            if (val === '' || (
                val !== '' && postal_code_regex.test(val)
            )) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.postal_code');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.postal_code');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message postal_code none">' + this._lang.__('ERROR_POSTAL_CODE_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                        var msg2 = $obj.parent().find('.error-message.minlength');
                        if (msg2.length > 0) {
                            msg2.remove();
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.postal_code');
                    if (msg.length == 0) {
                        var $er = $('<div class="error-message postal_code none">' + this._lang.__('ERROR_POSTAL_CODE_FORMAT') + '</div>');
                        $er.insertAfter($obj);
                        if (post != true) {
                            $er.slideDown();
                        }
                        $obj.addClass('error');
                    }
                    var msg2 = $obj.parent().find('.error-message.minlength');
                    if (msg2.length > 0) {
                        msg2.remove();
                    }
                }
                return false;
            }

        };

        validate_url = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            // $obj.val(Converter.toASCII($obj.val()));
            var param = {
                type: 'url',
                msg: false
            };
            var pattern = new RegExp('^((https|http):\/\/) => {1,}' + // protocol
                '((([a-z0-9\d]([a-z0-9\d-]*[a-z0-9\d])*)\.)+[a-z0-9]{2,}|' + // domain name
                '((\d{1,3}\.) => {3}\d{1,3}))' + // OR ip (v4) address
                '(\:\d+)?(\/[-a-z\d%_.~+]*)*'); //+ // port and path
            //'(\?[;&a-z\d%_.~+=-]*)?'+ // query string
            // '(\#[-a-z\d_]*)?$','i' //fragment locater
            // hungnh add toLowerCase date: 20160820
            var val = $obj.val().trim().toLowerCase();
            if (val === '' || (val !== '' && pattern.test(val))) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.url');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.url');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message url none">' + this._lang.__('ERROR_URL_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.url');
                    if (msg.length == 0) {
                        var msg = $obj.parent().find('.error-message.url');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message url none">' + this._lang.__('ERROR_URL_FORMAT') + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                }
                return false;
            }
        };

        validate_max_row = ($obj, trigger_ok, trigger_error, post) => {
            //convert fullwidth to halfwidth
            var param = {
                type: 'maxrow',
                msg: false
            };
            var text = $obj.val();
            var lines = text.split(/\r|\r\n|\n/);
            var count = lines.length;
            if ($obj.attr('maxrow') >= count) {
                if (trigger_ok) {
                    $obj.tmp = trigger_ok;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                } else {
                    var msg = $obj.parent().find('.error-message.maxrow');
                    if (msg.length > 0) {
                        msg.remove();
                        $obj.removeClass('error');
                    }
                }
                return true;
            } else {
                if (trigger_error) {
                    $obj.tmp = trigger_error;
                    $obj.tmp(param);
                    $obj.tmp = undefined;
                    if (param.msg === true) {
                        var msg = $obj.parent().find('.error-message.maxrow');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message maxrow none">' + this._lang.__('ERROR_MAX_ROW', $obj.attr('maxrow')) + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                } else {
                    var msg = $obj.parent().find('.error-message.maxrow');
                    if (msg.length == 0) {
                        var msg = $obj.parent().find('.error-message.maxrow');
                        if (msg.length == 0) {
                            var $er = $('<div class="error-message maxrow none">' + this._lang.__('ERROR_MAX_ROW', $obj.attr('maxrow')) + '</div>');
                            $er.insertAfter($obj);
                            if (post != true) {
                                $er.slideDown();
                            }
                            $obj.addClass('error');
                        }
                    }
                }
                return false;
            }
        };

        serialize = ($obj, formdata) => {
            let $el = $obj.find('input[type="text"], input[type="tel"], input[type="number"], input[type="email"], input[type="date"], input[type="password"], input[type="hidden"]');
            if (formdata) {
                let ret = new FormData();
                for (var i = 0; i < $el.length; i++) {
                    ret.append($el[i].name.trim(), $el[i].value.trim());
                }
                $el = $obj.find('input[type="file"]');
                //var ind = {};
                for (var i = 0; i < $el.length; i++) {
                    if ($el[i].files[0] !== undefined) {
                        ret.append($el[i].name, $el[i].files[0]);
                    }
                    //if($el[i].name.indexOf('[]')) {
                    //if(ind[$el[i].name]) {
                    //  data.append($el[i].name, $el[i].files);
                    //ind[$el[i].name] = ind[$el[i].name] + 1;
                    //} else {

                    //ind[$el[i].name] = 0;
                    //}
                    //}
                }
                $el = $obj.find('input[type="checkbox"]');
                for (var i = 0; i < $el.length; i++) {
                    if ($($el[i]).prop('checked') === true) {
                        ret.append($el[i].name.trim(), $el[i].value.trim());
                    }
                }
                $el = $obj.find('input[type="radio"]:checked');
                for (var i = 0; i < $el.length; i++) {
                    ret.append($el[i].name.trim(), $($el[i]).val().trim());
                }
                $el = $obj.find('textarea');
                for (var i = 0; i < $el.length; i++) {
                    ret.append($el[i].name.trim(), $($el[i]).val().trim());
                }
                $el = $obj.find('select');
                for (var i = 0; i < $el.length; i++) {
                    ret.append($el[i].name.trim(), $($el[i]).val().trim());
                }
                return ret;
            } else {
                let ret = {};
                for (var i = 0; i < $el.length; i++) {
                    ret[$el[i].name.trim()] = $el[i].value.trim();
                }
                $el = $obj.find('input[type="checkbox"]');
                for (var i = 0; i < $el.length; i++) {
                    if ($($el[i]).prop('checked') === true) {
                        ret[$el[i].name.trim()] = $el[i].value.trim();
                    }
                }
                $el = $obj.find('input[type="radio"]:checked');
                for (var i = 0; i < $el.length; i++) {
                    ret[$el[i].name.trim()] = $($el[i]).val().trim();
                }
                $el = $obj.find('textarea');
                for (var i = 0; i < $el.length; i++) {
                    ret[$el[i].name.trim()] = $($el[i]).val().trim();
                }
                $el = $obj.find('select');
                for (var i = 0; i < $el.length; i++) {
                    ret[$el[i].name.trim()] = $($el[i]).val().trim();
                }
                return ret;
            }
        };

        submit = (target) => {
            var $target = $(target),
                $form = $target.parents('form');
            if ($form.length > 0) {
                var $currentp = parseInt($form.find('.page.active').html()),
                    $pcount = $form.find('.page-counter');
                if ($pcount.length > 0) {
                    var pcounter = parseInt($($pcount[0]).val());
                    if ($target.hasClass('page') && !$target.hasClass('active')) {
                        $currentp = parseInt($target.html());
                    } else if ($target.hasClass('first-page')) {
                        $currentp = 1;
                    } else if ($target.hasClass('last-page')) {
                        $currentp = pcounter;
                    } else if ($target.hasClass('prev-page')) {
                        $currentp -= 1;
                    } else if ($target.hasClass('nxt-page')) {
                        $currentp += 1;
                    }
                    $form.append('<input type="hidden" name="page" value="' + $currentp + '" />');
                    $form.submit();
                }
            }
        };

        errors = ($form, errors, display) => {
            if (!display) {
                display = false;
            }
            if (!$form) return;
            var error_message = $form.find('.error-message');
            if (errors == '' && error_message.length > 0) {
                error_message.remove();
                $form.find('.error').removeClass('error');
            } else {
                for (var obj in errors) {
                    var field = $form.find('[name="' + obj + '"]');
                    field.addClass('error');
                    var fieldc = field.parent();
                    fieldc.find('.error-message').remove();
                    for (var type in errors[obj]) {
                        fieldc.append('<div class="error-message ' + type + ' ' + (display == false ? 'none' : '') + '">' + errors[obj][type] + '</div>');
                    }
                }
            }
        };

        message = ($message, $error) => {
            var message = $('<div class="message-float ' + ($error == true ? 'error' : '') + '" style="top: -100px">' + $message + '</div>');
            $('body').append(message);
            var top = -100;
            var interval = setInterval(function () {
                if (top >= 50) {
                    clearInterval(interval);
                    var wait = setTimeout(function () {
                        message.fadeOut(100);
                    }, 4000);
                }
                message.css('top', top + 'px');
                top += 10;
            }, 30);
        };

    }

    interface IValidation {
        $obj: any,
        trigger_ok: () => void,
        trigger_error: () => void,
        post: boolean
    }
}