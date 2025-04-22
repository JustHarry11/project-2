export default function passErrorToView(req,res,next){
    res.locals.errorMessage = ''
    next()
}