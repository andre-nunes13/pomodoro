import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, VStack } from "@chakra-ui/react";

const Achievements = () => {
  const { achievements } = useContext(AppContext);

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      border="1px solid"
      borderColor="xpGray.200"
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="xpGray.300">
        Conquistas
      </Text>
      {achievements.length > 0 ? (
        <VStack align="start" spacing={2}>
          {achievements.map((achievement, index) => (
            <Text key={index} color="xpGray.300">
              {achievement}
            </Text>
          ))}
        </VStack>
      ) : (
        <Text color="xpGray.300">Nenhuma conquista desbloqueada ainda.</Text>
      )}
    </Box>
  );
};

export default Achievements;