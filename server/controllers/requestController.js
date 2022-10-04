const asyncHandler = require("express-async-handler");
const Request = require("../models/request");
const User = require("../models/user");
const {createChat} = require("./utils");

const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;

  if (!recipientId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newRequest = {
    requester: req.user._id,
    recipient: recipientId,
    status: "pending",
  };

  try {
    const requestExists = await Request.findOne({
      recipient: { _id: recipientId },
      requester:{_id: req.user._id}
    });

     const second_request = await Request.findOneAndUpdate({
      $and: [
        { recipient: { _id: req.user._id }},
        { requester: { _id:  recipientId}},
      ],
    },{status:"success"})
    
 

    if (requestExists && requestExists.status === "rejected") {
      const request = await Request.findOneAndUpdate({
        $and: [
          {    recipient: { _id: recipientId }},
          {requester:{_id: req.user._id}},
        ],
      },{status:"pending"})
      res.status(201).json(request)
    }else if(requestExists){
      res.status(400);
      throw new Error("Request already exists");
    }else{
      if(!second_request){
        const request = await Request.create(newRequest);
  
        if (request) {
          res.status(201).json(request);
        } else {
          res.status(400);
          throw new Error("Request not found");
        }
  
      }else{
       
        const requester_user =  await User.findOneAndUpdate({_id:recipientId},{$addToSet:{"contacts":req.user._id}})
        const recipient_user = await User.findOneAndUpdate({_id:req.user._id},{$addToSet:{"contacts":recipientId}})
  
        const fullChat = createChat(recipientId,req.user._id)
        res.status(201).json({contacts:recipient_user.contacts,fullChat});
      }
    }
   

   
  } catch (error) {
    res.status(400);

    throw new Error(error.message);
  }
});

const getRequestsByRecipient = asyncHandler(async (req, res) => {

  try {
    const requests = await Request.find({
      recipient: { _id: req.user._id},
    }).populate("requester");
      res.status(201).json(requests);
  } catch (error) {
    res.status(400);

    throw new Error(error.message);
  }
});

const getRequestsByRequester = asyncHandler(async (req, res) => {

  try {
    const requests = await Request.find({
      requester: { _id: req.user._id},
    }).populate("requester");
    const unansweredRequests = requests.filter((r)=> r.status==="pending");
    const answeredRequests = requests.filter((r)=> r.status!=="pending");
      res.status(201).json({unansweredRequests,answeredRequests});
  } catch (error) {
    res.status(400);

    throw new Error(error.message);
  }
});
const answerRequest = asyncHandler(async (req, res) => {
  const requesterId = req.body.requesterId;
  const {status} = req.body;
  try{
    const request = await Request.findOneAndUpdate({
      $and: [
        { requester: { _id: requesterId }},
        { recipient: { _id: req.user._id }},
      ],
    },{status:status})

   
    if(status==="success"){
    if(request){
      const requester_user =  await User.findOneAndUpdate({_id:requesterId},{$addToSet:{"contacts":req.user._id}})
      const recipient_user = await User.findOneAndUpdate({_id:req.user._id},{$addToSet:{"contacts":req.body.requesterId}})
      
      const fullChat = createChat(req.user._id,requesterId)
      res.status(201).json({contacts:requester_user,fullChat});

    }else{
      throw new Error ("No request found")
    }
  }else{
    res.status(201).json({message:"request rejected",request})
  }
  }catch (error) {
    res.status(400)
    throw new Error(error.message);
  }
})

module.exports = { sendRequest,getRequestsByRequester,getRequestsByRecipient,answerRequest };
