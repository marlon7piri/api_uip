export const authMiddleware = (req,res,next)=>{

   console.log(req.header)

    next()
}