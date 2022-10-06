import { Avatar } from "@chakra-ui/avatar";
import { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";

const InviteListItem = ({
  handleFunction,
  user_m,
  requests,
  setFetchAgain,
  fetchAgain,
}) => {
  const API = process.env.REACT_APP_API_URL;

  const { user, setUser } = ChatState();
  const [disabled, setDisabled] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const recipientReqs = requests.filter(
      (request) => request.recipient === user_m._id
    );
    console.log(user)
    if (recipientReqs.length > 0 || (user.contacts && user.contacts.includes(user_m._id))) {
      setDisabled(true);
    }
  }, []);

  const handleRequest = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${API}/api/request`,
        { recipientId: user_m._id },
        config
      );
      const newUser = { ...user, contacts: data.contacts };
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      setUser(newUser);
      setFetchAgain(!fetchAgain);
      setDisabled(true);
      handleFunction();
      toast({
        title: "request send succesfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (e) {
      toast({
        title: "Error occured while handling request",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <Box
      cursor="pointer"
      bg="none"
      border="solid 1px #FFC857"
      _hover={{
        background: "#FFC857",
        color: "#114B5F",
      }}
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFC857"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user_m.name}
        src={user_m.pic}
      />
      <Box>
        <Text>{user_m.name}</Text>
      </Box>
      <Box>
        <Button
          colorScheme="blue"
          color={"#114B5F"}
          bg={"#FFC857"}
          _hover={{ background: "#114b5f", color: "#FFC857" }}
          onClick={() => handleRequest()}
          disabled={disabled}
        >
          Request
        </Button>
      </Box>
    </Box>
  );
};

export default InviteListItem;
