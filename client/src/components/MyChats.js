import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, Input } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();
  const API = process.env.REACT_APP_API_URL

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      color={"#FFC857"} bg={"#114B5F"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="block"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Contacts
        <div className="my-chats-container">
        <Input color={"#FFC857"} bg={"#114B5F"} borderColor="#FFC857" _hover={{borderColor:"#FFC857"}}_focus={{borderColor:"#FFC857" ,boxShadow:"none"}} placeholder="search" onChange={(e) => handleSearch(e)}></Input>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "12px", md: "7px", lg: "12px" }}
            rightIcon={<AddIcon />}
            color={"#FFC857"} bg={"#114B5F"}
            _hover={{color:"#114B5F",background:"#FFC857"}} _active={{color:"#114B5F",background:"#FFC857"}}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
        </div>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        border="1px solid #FFC857"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="auto" h="100%">
            {chats
              .filter((c) =>
                !c.isGroupChat
                  ? getSender(loggedUser, c.users).toLowerCase().includes(searchTerm.toLowerCase())
                  : c.chatName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "none" : "#FFC857"}
                  border={selectedChat === chat ? "1px solid #FFC857" : "none"}
                  color={selectedChat === chat ? "#FFC857" : "#114B5F"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
