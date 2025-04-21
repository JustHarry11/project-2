function passUserToView(req, res, next){
    res.locals.user = req.session.user
    return next()
}

export default passUserToView