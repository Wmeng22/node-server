exports.getGuid = function(len){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i <len; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random()*0x10), 1);
    }
    if(len == 16) {
        s[0] = "1";  // bits 12-15 of the time_hi_and_version field to 0010
    }
    var uuid = s.join("");
    return uuid;
}