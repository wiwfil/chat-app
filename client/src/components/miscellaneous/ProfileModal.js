import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Image,
  Input,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ userProfile, children }) => {
  const API = process.env.REACT_APP_API_URL;

  const { user, setUser } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pic, setPic] = useState(userProfile.pic);
  const [editable, setEditable] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [isAdmin, setIsAdmin] = useState(true);

  const handleChange = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userProfile.token}`,
        },
      };

      const { data } = await axios.put(
        `${API}/api/auth/update`,
        { name, pic },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
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

  const toggleEdit = () => {
    setEditable(true);
  };

  const postDetails = (pics) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "vagadrea");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  const handleOpen = () => {
    setEditable(false);
    onOpen();
  };
  useEffect(() => {
    if (user._id !== userProfile._id) {
      setIsAdmin(false);
    }
  }, [user._id, userProfile._id]);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton
          fontSize={24}
          bg="none"
          _hover={{ background: "none" }}
          _active={{ backgroundColor: "none" }}
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent
          color={"#FFC857"}
          bg={"#114B5F"}
          dispaly="flex"
          justifyContent="center"
          h="%100"
        >
          {isAdmin ? (
            !editable ? (
              <ModalHeader
                m="10px 0 0 0"
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="20px"
              >
                {userProfile.name}
              </ModalHeader>
            ) : (
              <ModalHeader
                m="20px 0 0 0"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                gap="10px"
              >
                <Input
                  w="70%"
                  placeholder={userProfile.name}
                  borderColor="1px solid #FFC857"
                  _hover={{ backgroundColor: " #114B5F" }}
                  _focus={{ borderColor: "#FFC857", boxShadow: "none" }}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  w="70%"
                  type="file"
                  p={1.5}
                  accept="image/*"
                  borderColor="1px solid #FFC857"
                  _hover={{ backgroundColor: " #114B5F" }}
                  _focus={{ borderColor: "#FFC857", boxShadow: "none" }}
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </ModalHeader>
            )
          ) : (
            <ModalHeader
              m="10px 0 0 0"
              fontSize="40px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              {userProfile.name}
            </ModalHeader>
          )}

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              objectFit='cover'
              src={userProfile.pic}
              alt={userProfile.name}
            />
          </ModalBody>
          <ModalFooter display="flex" gap="10px">
            {isAdmin ? (
              editable ? (
                <Button
                  color={"#114B5F"}
                  bg={"#FFC857"}
                  _hover={{
                    background: "none",
                    border: "1px solid #FFC857",
                    color: "#FFC857",
                  }}
                  onClick={handleChange}
                  isLoading={picLoading}
                >
                  Update
                </Button>
              ) : (
                <Button
                  color={"#114B5F"}
                  bg={"#FFC857"}
                  _hover={{
                    background: "none",
                    border: "1px solid #FFC857",
                    color: "#FFC857",
                  }}
                  onClick={toggleEdit}
                  isLoading={picLoading}
                >
                  Edit
                </Button>
              )
            ) : (
              <></>
            )}
            <Button
              color={"#114B5F"}
              bg={"#FFC857"}
              _hover={{
                background: "none",
                border: "1px solid #FFC857",
                color: "#FFC857",
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
