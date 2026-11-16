import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, Progress, Button, Stack, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

const PomodoroTimer = ({ setIsSettingsOpen }) => {
  const {
    workTime,
    breakTime,
    longBreakTime,
    cyclesBeforeLongBreak,
    strictMode,
    timeLeft,
    isRunning,
    isWorkSession,
    cycleCount,
    toggleTimer,
    resetTimer,
    formatTime,
    t,
  } = useContext(AppContext);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;
      switch (event.key) {
        case " ": event.preventDefault(); toggleTimer(); break;
        case "r":
        case "R": resetTimer(); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer, resetTimer]);

  const totalTime = isWorkSession ? workTime * 60 : cycleCount >= cyclesBeforeLongBreak - 1 ? longBreakTime * 60 : breakTime * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const fontSizeTitle = useBreakpointValue({ base: "xl", md: "2xl" });
  const fontSizeTimer = useBreakpointValue({ base: "3xl", md: "5xl" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box p={6} bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize={fontSizeTitle} fontWeight="bold" color="xpGray.300">
          {isWorkSession ? t("Work") : t("Break")}
        </Text>
        <IconButton
          icon={<SettingsIcon />}
          size="sm"
          variant="base"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "xpBlue.400" }}
          onClick={() => setIsSettingsOpen(true)}
          aria-label={t("Configure Timer")}
        />
      </Stack>
      <Text fontSize={fontSizeTimer} fontFamily="mono" mb={4} color="xpGray.300">
        {formatTime(timeLeft)}
      </Text>
      <Progress value={progress} size="sm" mb={4} bg="xpGray.200" boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)" />
      <Box mb={4}>
        <Text fontSize="sm" color="xpGray.300">
          {t("Cycle")} {cycleCount + 1} {t("of")} {cyclesBeforeLongBreak}
        </Text>
        <Progress value={((cycleCount + 1) / cyclesBeforeLongBreak) * 100} size="xs" colorScheme="green" bg="xpGray.200" />
      </Box>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <Button
          onClick={toggleTimer}
          variant={isRunning ? "actionYellow" : "actionGreen"}
          size={buttonSize}
          leftIcon={isRunning ? <>⏸</> : <>▶</>}
          isDisabled={strictMode && isRunning}
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: isRunning ? "#FFD700" : "#00A000" }}
          _disabled={{ bg: "xpGray.200", cursor: "not-allowed" }}
        >
          {isRunning ? t("Pause") : t("Start")}
        </Button>
        <Button
          onClick={resetTimer}
          variant="actionRed"
          size={buttonSize}
          leftIcon={<>⏹</>}
          isDisabled={strictMode}
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#FF4040" }}
          _disabled={{ bg: "xpGray.200", cursor: "not-allowed" }}
        >
          {t("Reset")}
        </Button>
      </Stack>
    </Box>
  );
};

export default React.memo(PomodoroTimer);