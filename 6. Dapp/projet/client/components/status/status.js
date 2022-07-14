import {
  Heading,
  Box,
  VStack,
  StackDivider,
  Tag,
  TagLabel,
  Text,
  ListItem,
  List,
} from "@chakra-ui/react";

export default function Status(props) {
  const { currentStatus } = props;

  return (
    <>
      <Box padding="6" mb="4">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={6}
          align="stretch"
        >
          <Heading textAlign={"center"}>Current status</Heading>

          <List spacing={8}>
            <ListItem>
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                1
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 0 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Registering Voters</Text>
                </TagLabel>
              </Tag>
            </ListItem>
            <ListItem>
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                2
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 1 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Proposals Registration Started</Text>
                </TagLabel>
              </Tag>
            </ListItem>
            <ListItem>
              {" "}
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                3
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 2 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Proposals Registration Ended</Text>
                </TagLabel>
              </Tag>
            </ListItem>
            <ListItem>
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                4
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 3 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Voting Session Started</Text>
                </TagLabel>
              </Tag>
            </ListItem>
            <ListItem>
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                5
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 4 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Voting Session Ended</Text>
                </TagLabel>
              </Tag>
            </ListItem>
            <ListItem>
              <Tag
                borderRadius="full"
                variant="solid"
                mt="1"
                mr="3"
                size="md"
                colorScheme="teal"
              >
                6
              </Tag>
              <Tag
                borderRadius="full"
                variant="solid"
                size="lg"
                colorScheme={currentStatus === 5 ? "blue" : "gray"}
              >
                <TagLabel>
                  <Text>Votes Tallied</Text>
                </TagLabel>
              </Tag>
            </ListItem>
          </List>
        </VStack>
      </Box>
    </>
  );
}
