function redirectRouterTop(req, res, next) {
  if (!req.originalUrl.endsWith("/")) {
    // "/sume_rouer" にアクセスされた時は"/some_router/"に移動してもらう  
    res.redirect(req.originalUrl + "/")
    next("route")
  } else {
    next()
  }
}

module.exports = {
  redirectRouterTop
}