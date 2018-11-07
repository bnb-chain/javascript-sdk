const isValidAddress = address => {
  // TODO: proper secp256k1 address validation
  if(!address) {
    return false
  }

  return true;
}

const isValidSymbol = symbol => {
  // TODO: proper symbol validation
  if(!symbol || symbol.length < 3) {
    return false
  }

  return true;
}

const isValidTx = tx => {
  // TODO: proper tx validation
  if(!tx || tx === "") {
    return false
  }

  return true;
}

const isValidURL = (str) => {
  if(!str) {
    return false
  }
  
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}

module.exports = {
  isValidAddress,
  isValidSymbol,
  isValidTx,
  isValidURL
}