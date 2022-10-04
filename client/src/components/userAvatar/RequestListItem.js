import { Avatar } from "@chakra-ui/avatar";
import {useState,useEffect} from "react"
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";

const RequestListItem = ({ request,handleFunction,setFetchAgain,fetchAgain }) => {

  const { user,setUser } = ChatState();
  const toast = useToast();
  const [isDisabled,setIsDisabled] = useState(false);

  const API = process.env.REACT_APP_API_URL

  const handleAccept = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put(
        `${API}/api/request`,
        { requesterId: request.requester._id,status:"success" },
        config
      );
      handleFunction();
      setIsDisabled(true);
      const newUser = {...user,contacts:data.contacts}
        setFetchAgain(!fetchAgain)
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      setUser(newUser);
        

      toast({
        title: "request send succesfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (e) {
      toast({
        title: "An error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleReject = async () => {

    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put(
        `${API}/api/request`,
        { requesterId: request.requester._id,status:"rejected" },
        config
      );  
      handleFunction();
        setIsDisabled(true)

      toast({
        title: "Request send successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (e) {
      toast({
        title: "An error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }
useEffect(()=>{

},)

  return (
    <Box
      cursor="pointer"
      bg="none"
      border="solid 1px #FFC857"
      _hover={{

        background:"#FFC857",
        color: "#114B5F",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={request.requester.name}
        src={request.requester.pic}
      />
      <Box>
        <Text>{request.requester.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {request.requester.email}
        </Text>
      </Box>
      <Box>
 <Button   colorScheme="blue" color={"#114B5F"} bg={"#FFC857"} _hover={{background:"#114b5f",color:"#FFC857"}}  disabled={isDisabled} onClick={()=>handleAccept()}>Accept</Button>
      </Box>
      <Box>

        <Button   colorScheme="blue" color={"#114B5F"} bg={"#FFC857"} _hover={{background:"#114b5f",color:"#FFC857"}}  disabled={isDisabled} onClick={()=>handleReject()}>Reject</Button>
      </Box>
    </Box>
  );
};

export default RequestListItem;
