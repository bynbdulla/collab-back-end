// const Meetings = require("../models/meetings")

// const create = async (req,res) =>{
//     try{
//         req.body.author = req.user._id //attention
//         const meeting = await Meetings.create(req.body)
//         meeting._doc.author = req.user
//         res.status(201).json(meeting)
//     } catch(err){
//         res.status(500).json({err: err.message})
//     }
// }



// module.exports = {
//     create,
// }