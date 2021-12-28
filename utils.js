
function customCutString(str, max = 0, extend = ''){
   // returns short string if long from the given max, extend can be added to the end of the string 
   return (str.length > max) ? str.substr(0, max - 1) + extend: str;
}

module.exports = {
    customCutString,
}