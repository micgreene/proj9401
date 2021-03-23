'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    if(req.user.capabilities.includes(capability)){
      next();
    } else {
      next('Does Not Possess Proper Permissions!')
    }
  }
}