import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {IconButton } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";

import RequestListItem from "../userAvatar/RequestListItem";
import { ChatState } from "../../Context/ChatProvider";
import InviteListItem from "../userAvatar/InviteListItem";

function SideDrawer({ setFetchAgain, fetchAgain }) {
  const API = process.env.REACT_APP_API_URL;

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateChange, setStateChange] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const {
    user,
    requests,
    setRequests,
    inactiveRequests,
    setInactiveRequests,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/auth?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  useEffect(() => {
    const fetchRequests = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      try{
        const { data } = await axios.get(`${API}/api/request/recipient`, config);
        const reqs = await axios.get(`${API}/api/request/requester`, config);
        setInactiveRequests(reqs.data.unansweredRequests);
        setNotificationCount(
          data.filter((req) => req.status === "pending").length
        );
        setRequests(data);
      }catch (error) {
        console.log(error)
      }
    
    };
    fetchRequests();
  }, [stateChange]);
  const handleStateChange = () => {
    setStateChange(!stateChange);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        color={"#FFC857"}
        bg={"#114B5F"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            color={"#FFC857"}
            bg={"#114B5F"}
            _hover={{ bg: "#FFC857", color: "#114B5F" }}
            _active={{ bg: "#FFC857", color: "#FFC857" }}
            _focus={{ bg: "#FFC857", color: "#114B5F" }}
            variant="ghost"
            onClick={onOpen}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
        Chatters
        </Text>
        <div className="menu-right">
          <Menu>
            <MenuButton p={1} as={IconButton}         fontSize="24"
                  color={"#FFC857"}
                  bg={"#114B5F"} 
                  _hover={{ bg: 'none' }}
                  _expanded={{ bg: 'none' }}
                  _focus={{ boxShadow: 'none',bg:"none" }}
                  icon={<BellIcon />}>
              <div  className="icon-button">
        
                {notificationCount > 0 && (
                  <span className="icon-button__badge">
                    {notificationCount}
                  </span>
                )}
              </div>
            </MenuButton>
            <MenuList color={"#114B5F"} bg={"#FFC857"} pl={2}>
              {notificationCount === 0 && "No New Requests"}
              {requests
                .filter((req) => req.status === "pending")
                .map((req) => (
                  <RequestListItem
                    key={req._id}
                    request={req}
                    handleFunction={handleStateChange}
                    setFetchAgain={setFetchAgain}
                    fetchAgain={fetchAgain}
                  />
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              _hover={{ bg: "#114B5F" }}
              _expanded={{ bg: "#114B5F" }}
              _active={{ bg: "#114B5F" }}
              color={"#FFC857"}
              bg={"#114B5F"}
              m={"auto 0px"}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList p={0} color={"#114B5F"} bg={"#FFC857"}>
              <ProfileModal userProfile={user}>
                <MenuItem
                  borderRadius={"4px"}
                  color={"#114B5F"}
                  bg={"#FFC857"}
                  _hover={{ bg: "#114B5F", color: "#FFC857" }}
                  _active={{ bg: "#114B5F", color: "#FFC857" }}
                  _focus={{ bg: "#114B5F", color: "#FFC857" }}
                >
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider m={0} />
              <MenuItem
                borderRadius={"4px"}
                color={"#114B5F"}
                bg={"#FFC857"}
                _hover={{ bg: "#114B5F", color: "#FFC857" }}
                _active={{ bg: "#114B5F", color: "#FFC857" }}
                _focus={{ bg: "#114B5F", color: "#FFC857" }}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent color={"#FFC857"} bg={"#114B5F"}>
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="#FFC857"
            textAlign="center"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                borderColor="#FFC857"
                _focusVisible={{ borderColor: "#FFC857", boxShadow: "#FFC857" }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button color={"#114B5F"} bg={"#FFC857"} onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((searchedUser) => {
                return (
                  <InviteListItem
                    key={searchedUser._id}
                    user_m={searchedUser}
                    requests={inactiveRequests}
                    handleFunction={handleStateChange}
                    setFetchAgain={setFetchAgain}
                    fetchAgain={fetchAgain}
                  />
                );
              })
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
