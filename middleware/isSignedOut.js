export default function isSignedOut(req, res, next) {
    if(!req.session.user) {
        return next()
    }
    return res.redirect('/thoughts')
}