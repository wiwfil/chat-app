import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();


  return (
    <div key={messages}>
      {messages !== [] &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span
            
              style={{
                display:"flex",
                gap:"10px",
                backgroundColor: `${
                  m.sender._id === user._id ? "#65d649" : "#FFC857"

                }`,
                fontSize:"18px",
                color:"#114B5F",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginRight:"10px",
                borderRadius: "15px",
                padding: "5px 10px",
                maxWidth: "75%",
              }}
            >
              <span>{m.content}</span>
              <span  style={{fontSize:"10px" ,
                alignSelf: "flex-end"}}>{m.createdAt.slice(11,16)}</span>
            </span>

          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
