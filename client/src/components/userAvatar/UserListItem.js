import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

const UserListItem = ({ handleFunction, user_m }) => {

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
      <Button  colorScheme="blue" color={"#114B5F"} bg={"#FFC857"} _hover={{background:"#114b5f",color:"#FFC857"}} onClick={handleFunction}>Add</Button>
    </Box>
  );
};

export default UserListItem;
