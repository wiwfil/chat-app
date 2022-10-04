const Chat = require("../models/chatRoom");

const createChat = async(userId,current_user_id) => {
    var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [ userId,current_user_id],
      };
  
      try {
        const isChatExists = await Chat.findOne({users:[userId,current_user_id]})
        if(isChatExists) {
          return ("chat already exists");
        }else{
          const createdChat = await Chat.create(chatData);
          const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
         return (FullChat);
        }

      } catch (error) {
  
        throw new Error(error.message);
      }
    
  };


  module.exports = {createChat}