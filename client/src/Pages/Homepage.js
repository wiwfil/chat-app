import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent m="auto">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg={"#114B5F"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color={"#FFC857"} bg={"#114B5F"}>
        Chatters
        </Text>
      </Box>
      <Box color={"#FFC857"} w="100%" p={4} borderRadius="lg" borderWidth="1px" bg={"#114B5F"}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab  color={"#FFC857"} _selected={{color:"#114B5F",bg: '#FFC857'}}>Login</Tab>
            <Tab  color={"#FFC857"} _selected={{color:"#114B5F",bg: '#FFC857'}}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
