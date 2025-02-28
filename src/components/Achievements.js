import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, SimpleGrid, Badge, Tooltip } from "@chakra-ui/react";

const Achievements = () => {
  const { achievements, achievementList } = useContext(AppContext);

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      border="1px solid"
      borderColor="xpGray.200"
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
      maxH="500px"
      overflowY="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="xpGray.300">
        Conquistas
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {achievementList.map((achievement) => {
          const isUnlocked = achievements.some(a => a.id === achievement.id);
          const unlockedData = achievements.find(a => a.id === achievement.id);

          return (
            <Tooltip key={achievement.id} label={achievement.description} placement="top">
              <Box
                p={3}
                bg={isUnlocked ? "xpGreen.500" : "xpGray.200"}
                border="1px solid"
                borderColor="xpGray.200"
                boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                borderRadius="md"
                color={isUnlocked ? "white" : "xpGray.300"}
                opacity={isUnlocked ? 1 : 0.6}
                transition="all 0.2s"
                _hover={{ opacity: 1, boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                <Text fontWeight="bold" fontSize="md">
                  {achievement.name}
                </Text>
                <Text fontSize="sm">{achievement.description}</Text>
                {isUnlocked && (
                  <Badge mt={2} colorScheme="yellow">
                    Desbloqueado em: {unlockedData.unlockedAt}
                  </Badge>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Achievements;