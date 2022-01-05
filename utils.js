// const bcrypt = require('bcrypt');

function customCutString(str, max = 0, extend = ''){
   // returns short string if long from the given max, extend can be added to the end of the string 
   return (str.length > max) ? str.substr(0, max - 1) + extend: str;
}

// bcrypt.hash('key str ...', 10, function(err, hash) {
//     // console.log(hash);
//  });

module.exports = {
    customCutString,
}