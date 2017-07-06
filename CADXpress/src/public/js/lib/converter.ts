export class Converter {
    static toASCII = (chars) => {
        var ascii = '';
        var halfsize = true;
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
        var halfw = [
            0xFF67, 0xFF71, 0xFF68, 0xFF72, 0xFF69, 0xFF73, 0xFF6A, 0xFF74,
            0xFF6B, 0xFF75, 0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B,
            0xFF7C, 0xFF7D, 0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF6F, 0xFF82,
            0xFF83, 0xFF85, 0xFF86, 0xFF87, 0xFF88, 0xFF89, 0xFF8A, 0xFF8B,
            0xFF8C, 0xFF8D, 0xFF8E, 0xFF8F, 0xFF90, 0xFF91, 0xFF92, 0xFF93,
            0xFF6C, 0xFF94, 0xFF6D, 0xFF95, 0xFF6E, 0xFF96, 0xFF97, 0xFF98,
            0xFF99, 0xFF9A, 0xFF9B, 0xFF9C, 0xFF9C, 0xFF66, 0xFF9D, 0x30F5,
            0x30F6,
        ];

        //EE F1 F2 F4 ...NOT FOUND
        // has "
        var fullws1 = [
            0x30ac, 0x30ae, 0x30B0, 0x30B2, 0x30B4, 0x30B6, 0x30B8, 0x30BA,
            0x30BC, 0x30BE, 0x30C0, 0x30C2, 0x30C5, 0x30C7, 0x30C9, 0x30D0,
            0x30D3, 0x30D6, 0x30D9, 0x30DC, 0x30F4, 0x30F7, 0x30f4
        ];
        var halfws1 = [
            0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B, 0xFF7C, 0xFF7D,
            0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF82, 0xFF83, 0xFF84, 0xFF8A,
            0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E, 0xFF73, 0xFF9C, 0xff73
        ];
        //has o
        var fullws2 = [
            0x30D1, 0x30D4, 0x30D7, 0x30DA, 0x30DD
        ];
        var halfws2 = [
            0xFF8A, 0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E
        ];
        // // has ｨ
        // var fullws3 = [
        //   0x30F0
        // ];
        // var halfws3 = [
        //   0xFF73
        // ];// has
        // var fullws4 = [
        //   0x30F1
        // ];
        // var halfws4 = [
        //   0xFF73
        // ];


        for (var i = 0; i < chars.length; i++) {
            var c = chars[i].charCodeAt(0);
            // if((c >= 0x3000 && c <= 0x303f) ||
            //   (c >= 0x3040 && c <= 0x309f) ||
            //   (c >= 0x30a0 && c <= 0x30ff) ||
            //   (c >= 0xff00 && c <= 0xff5e) ||
            //   (c >= 0x4e00 && c <= 0x9faf) ||
            //   (c >= 0x3400 && c <= 0x4dbf)
            // ) {
            //alpha
            if (c >= 0xff00 && c <= 0xff5e) {
                c = 0xFF & (c + 0x20);
                ascii += String.fromCharCode(c);
            } else if (fullw.indexOf(c) != -1) {
                //katakana fullwidth no sign
                var indx = fullw.indexOf(c);
                if (indx != -1) {
                    c = halfw[indx];
                }
                ascii += String.fromCharCode(c);
            } else if (fullws1.indexOf(c) != -1) {
                //katakana fullwidth has sign 1
                var indx = fullws1.indexOf(c);
                if (indx != -1) {
                    c = halfws1[indx];
                }
                ascii += String.fromCharCode(c) + String.fromCharCode(0xff9e);
            } else if (fullws2.indexOf(c) != -1) {
                //katakana fullwidth has sign 1
                var indx = fullws2.indexOf(c);
                if (indx != -1) {
                    c = halfws2[indx];
                }
                ascii += String.fromCharCode(c) + String.fromCharCode(0xff68);
                // } else if(fullws3.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws3.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws3[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xff9f);
                // } else if(fullws4.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws4.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws4[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xff6a);
                // } else if(fullws5.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws5.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws5[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xFF9E)+String.fromCharCode(0xFF67);
            } else {
                ascii += String.fromCharCode(c);
            }
            halfsize = false;
            // }
        }
        if (halfsize == true) {
            return chars;
        }
        return ascii;
    };

    static toFullWidth = (chars) => {
        var ascii = '';
        var fullsize = true;
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
        var halfw = [
            0xFF67, 0xFF71, 0xFF68, 0xFF72, 0xFF69, 0xFF73, 0xFF6A, 0xFF74,
            0xFF6B, 0xFF75, 0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B,
            0xFF7C, 0xFF7D, 0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF6F, 0xFF82,
            0xFF83, 0xFF85, 0xFF86, 0xFF87, 0xFF88, 0xFF89, 0xFF8A, 0xFF8B,
            0xFF8C, 0xFF8D, 0xFF8E, 0xFF8F, 0xFF90, 0xFF91, 0xFF92, 0xFF93,
            0xFF6C, 0xFF94, 0xFF6D, 0xFF95, 0xFF6E, 0xFF96, 0xFF97, 0xFF98,
            0xFF99, 0xFF9A, 0xFF9B, 0xFF9C, 0xFF9C, 0xFF66, 0xFF9D, 0x30F5,
            0x30F6,
        ];

        //EE F1 F2 F4 ...NOT FOUND
        // has "
        var fullws1 = [
            0x30ac, 0x30ae, 0x30B0, 0x30B2, 0x30B4, 0x30B6, 0x30B8, 0x30BA,
            0x30BC, 0x30BE, 0x30C0, 0x30C2, 0x30C5, 0x30C7, 0x30C9, 0x30D0,
            0x30D3, 0x30D6, 0x30D9, 0x30DC, 0x30F4, 0x30F7, 0x30f4
        ];
        var halfws1 = [
            0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B, 0xFF7C, 0xFF7D,
            0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF82, 0xFF83, 0xFF84, 0xFF8A,
            0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E, 0xFF73, 0xFF9C, 0xff73
        ];
        //has o
        var fullws2 = [
            0x30D1, 0x30D4, 0x30D7, 0x30DA, 0x30DD
        ];
        var halfws2 = [
            0xFF8A, 0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E
        ];
        // // has ｨ
        // var fullws3 = [
        //   0x30F0
        // ];
        // var halfws3 = [
        //   0xFF73
        // ];// has
        // var fullws4 = [
        //   0x30F1
        // ];
        // var halfws4 = [
        //   0xFF73
        // ];
        var skip_nxt = false;
        for (var i = 0; i < chars.length; i++) {
            if (skip_nxt == true) {
                skip_nxt = false;
            } else {
                var c = chars[i].charCodeAt(0);
                // if(i + 1 < chars.length) {
                //   var nc = chars[i + 1].charCodeAt(0);
                // }
                // //if half width
                // if((c >= 0xFF67 && c <= 0x30F6) ||
                //   (c >= 0xFF76 && c <= 0xff73) ||
                //   (c >= 0x30a0 && c <= 0x30ff) ||
                //   (c >= 0xff00 && c <= 0xff5e) ||
                //   (c >= 0x4e00 && c <= 0x9faf) ||
                //   (c >= 0x3400 && c <= 0x4dbf)
                // ) {
                //alpha
                if (c >= 0x21 && c <= 0x7e) {
                    c = 0xFF00 | (c - 0x20);
                    ascii += String.fromCharCode(c);
                } else if (halfw.indexOf(c) != -1) {
                    //katakana fullwidth no sign
                    var indx = halfw.indexOf(c);
                    if (indx != -1) {
                        c = fullw[indx];
                    }
                    ascii += String.fromCharCode(c);
                } else if (i + 1 < chars.length && halfws1.indexOf(c) != -1 && chars[i + 1] == 0xff9e) {
                    //katakana fullwidth has sign 1
                    var indx = halfws1.indexOf(c);
                    if (indx != -1) {
                        c = fullws1[indx];
                        skip_nxt = true;
                    }
                    ascii += String.fromCharCode(c);
                } else if (i + 1 < chars.length && halfws2.indexOf(c) != -1 && chars[i + 1] == 0xff68) {
                    //katakana fullwidth has sign 1
                    var indx = halfws2.indexOf(c);
                    if (indx != -1) {
                        c = fullws2[indx];
                        skip_nxt = true;
                    }
                    ascii += String.fromCharCode(c);
                } else {
                    ascii += String.fromCharCode(c);
                }
                fullsize = false;
                // }
            }
        }
        if (fullsize == true) {
            return chars;
        }
        return ascii;
    };

    static toHalfWidth = (chars) => {
        var ascii = '';
        var halfsize = true;
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
        var halfw = [
            0xFF67, 0xFF71, 0xFF68, 0xFF72, 0xFF69, 0xFF73, 0xFF6A, 0xFF74,
            0xFF6B, 0xFF75, 0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B,
            0xFF7C, 0xFF7D, 0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF6F, 0xFF82,
            0xFF83, 0xFF85, 0xFF86, 0xFF87, 0xFF88, 0xFF89, 0xFF8A, 0xFF8B,
            0xFF8C, 0xFF8D, 0xFF8E, 0xFF8F, 0xFF90, 0xFF91, 0xFF92, 0xFF93,
            0xFF6C, 0xFF94, 0xFF6D, 0xFF95, 0xFF6E, 0xFF96, 0xFF97, 0xFF98,
            0xFF99, 0xFF9A, 0xFF9B, 0xFF9C, 0xFF9C, 0xFF66, 0xFF9D, 0x30F5,
            0x30F6,
        ];

        //EE F1 F2 F4 ...NOT FOUND
        // has "
        var fullws1 = [
            0x30ac, 0x30ae, 0x30B0, 0x30B2, 0x30B4, 0x30B6, 0x30B8, 0x30BA,
            0x30BC, 0x30BE, 0x30C0, 0x30C2, 0x30C5, 0x30C7, 0x30C9, 0x30D0,
            0x30D3, 0x30D6, 0x30D9, 0x30DC, 0x30F4, 0x30F7, 0x30f4
        ];
        var halfws1 = [
            0xFF76, 0xFF77, 0xFF78, 0xFF79, 0xFF7A, 0xFF7B, 0xFF7C, 0xFF7D,
            0xFF7E, 0xFF7F, 0xFF80, 0xFF81, 0xFF82, 0xFF83, 0xFF84, 0xFF8A,
            0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E, 0xFF73, 0xFF9C, 0xff73
        ];
        //has o
        var fullws2 = [
            0x30D1, 0x30D4, 0x30D7, 0x30DA, 0x30DD
        ];
        var halfws2 = [
            0xFF8A, 0xFF8B, 0xFF8C, 0xFF8D, 0xFF8E,
        ];
        // // has ｨ
        // var fullws3 = [
        //   0x30F0
        // ];
        // var halfws3 = [
        //   0xFF73
        // ];// has
        // var fullws4 = [
        //   0x30F1
        // ];
        // var halfws4 = [
        //   0xFF73
        // ];


        for (var i = 0; i < chars.length; i++) {
            var c = chars[i].charCodeAt(0);
            // make sure we only convert half-full width char
            // if (c >= 0xFF00 && c <= 0xFFEF) {
            // if((c >= 0x3000 && c <= 0x303f) ||
            //   (c >= 0x3040 && c <= 0x309f) ||
            //   (c >= 0x30a0 && c <= 0x30ff) ||
            //   (c >= 0xff00 && c <= 0xff5e) ||
            //   (c >= 0x4e00 && c <= 0x9faf) ||
            //   (c >= 0x3400 && c <= 0x4dbf)
            // ) {
            //alpha
            if (c >= 0xff00 && c <= 0xff5e) {
                c = 0xFF & (c + 0x20);
                ascii += String.fromCharCode(c);
            } else if (fullw.indexOf(c) != -1) {
                //katakana fullwidth no sign
                var indx = fullw.indexOf(c);
                if (indx != -1) {
                    c = halfw[indx];
                }
                ascii += String.fromCharCode(c);
            } else if (fullws1.indexOf(c) != -1) {
                //katakana fullwidth has sign 1
                var indx = fullws1.indexOf(c);
                if (indx != -1) {
                    c = halfws1[indx];
                }
                ascii += String.fromCharCode(c) + String.fromCharCode(0xff9e);
            } else if (fullws2.indexOf(c) != -1) {
                //katakana fullwidth has sign 1
                var indx = fullws2.indexOf(c);
                if (indx != -1) {
                    c = halfws2[indx];
                }
                ascii += String.fromCharCode(c) + String.fromCharCode(0xff68);
                // } else if(fullws3.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws3.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws3[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xff9f);
                // } else if(fullws4.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws4.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws4[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xff6a);
                // } else if(fullws5.indexOf(c) != -1) {
                //    //katakana fullwidth has sign 1
                //    var indx = fullws5.indexOf(c);
                //    if(indx != -1) {
                //      c = halfws5[indx];
                //    }
                //    ascii += String.fromCharCode(c) + String.fromCharCode(0xFF9E)+String.fromCharCode(0xFF67);
            } else {
                ascii += String.fromCharCode(c);
            }
            halfsize = false;
            // }
        }
        if (halfsize == true) {
            return chars;
        }
        return ascii;
    };

}