import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Progress,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionModalContent = motion(ModalContent);

const PomodoroTimer = () => {
  const {
    workTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLongBreakTime,
    cyclesBeforeLongBreak,
    setCyclesBeforeLongBreak,
    strictMode,
    setStrictMode,
    notificationsEnabled,
    setNotificationsEnabled,
    timeLeft,
    isRunning,
    isWorkSession,
    cycleCount,
    toggleTimer,
    resetTimer,
    formatTime,
    t,
  } = useContext(AppContext);

  const [isConfigOpen, setIsConfigOpen] = React.useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;
      switch (event.key) {
        case " ":
          event.preventDefault();
          toggleTimer();
          break;
        case "r":
        case "R":
          resetTimer();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer, resetTimer]);

  const handleConfigClose = () => {
    setIsConfigOpen(false);
  };

  const totalTime = isWorkSession
    ? workTime * 60
    : cycleCount >= cyclesBeforeLongBreak - 1
    ? longBreakTime * 60
    : breakTime * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      border="1px solid"
      borderColor="xpGray.200"
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
    >
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="xpGray.300">
          {isWorkSession ? t("Work") : t("Break")}
        </Text>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon />}
            size="sm"
            variant="base"
            border="1px solid"
            borderColor="xpGray.200"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "xpBlue.400" }}
          />
          <MenuList
            bg="xpBlue.100"
            border="1px solid"
            borderColor="xpGray.200"
            boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
          >
            <MenuItem onClick={() => setIsConfigOpen(true)} variant="base">
              {t("Configure Timer")}
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
      <Text fontSize="5xl" fontFamily="mono" mb={4} color="xpGray.300">
        {formatTime(timeLeft)}
      </Text>
      <Progress
        value={progress}
        size="sm"
        mb={4}
        bg="xpGray.200"
        boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
      />
      <Box mb={4}>
        <Text fontSize="sm" color="xpGray.300">
          {t("Cycle")} {cycleCount + 1} {t("of")} {cyclesBeforeLongBreak}
        </Text>
        <Progress
          value={((cycleCount + 1) / cyclesBeforeLongBreak) * 100}
          size="xs"
          colorScheme="green"
          bg="xpGray.200"
        />
      </Box>
      <Stack direction="row" spacing={4}>
        <Button
          onClick={toggleTimer}
          variant={isRunning ? "actionYellow" : "actionGreen"}
          size="lg"
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
          size="lg"
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

      <Modal isOpen={isConfigOpen} onClose={handleConfigClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <MotionModalContent
          bg="xpBlue.100"
          border="2px solid"
          borderColor="xpGray.200"
          boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <ModalHeader
            bgGradient="linear(to-r, xpBlue.200, xpBlue.300)"
            color="white"
            borderBottom="1px solid"
            borderColor="xpGray.200"
            fontSize="sm"
            p={1}
          >
            {t("Timer Settings")}
          </ModalHeader>
          <ModalCloseButton
            variant="actionRed"
            size="xs"
            border="1px solid"
            borderColor="xpGray.200"
            _hover={{ bg: "xpRed.600" }}
          />
          <ModalBody p={4}>
            <Stack spacing={4}>
              <Box>
                <Text mb={2} fontSize="sm" color="xpGray.300">
                  {t("Work Time (min)")}
                </Text>
                <NumberInput
                  value={workTime}
                  onChange={(_, value) => setWorkTime(value)}
                  min={1}
                  max={120}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" color="xpGray.300">
                  {t("Short Break Time (min)")}
                </Text>
                <NumberInput
                  value={breakTime}
                  onChange={(_, value) => setBreakTime(value)}
                  min={1}
                  max={60}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" color="xpGray.300">
                  {t("Long Break Time (min)")}
                </Text>
                <NumberInput
                  value={longBreakTime}
                  onChange={(_, value) => setLongBreakTime(value)}
                  min={1}
                  max={60}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" color="xpGray.300">
                  {t("Cycles Before Long Break")}
                </Text>
                <NumberInput
                  value={cyclesBeforeLongBreak}
                  onChange={(_, value) => setCyclesBeforeLongBreak(value)}
                  min={1}
                  max={10}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Checkbox
                isChecked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                colorScheme="blue"
                borderColor="xpGray.200"
                bg="xpBlue.100"
                color="xpGray.300"
              >
                {t("Strict Mode (no manual pauses or resets)")}
              </Checkbox>
              <Checkbox
                isChecked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                colorScheme="blue"
                borderColor="xpGray.200"
                bg="xpBlue.100"
                color="xpGray.300"
              >
                {t("Sound Notifications")}
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter p={2}>
            <Button
              variant="base"
              onClick={handleConfigClose}
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "xpBlue.400" }}
              size="sm"
            >
              {t("OK")}
            </Button>
          </ModalFooter>
        </MotionModalContent>
      </Modal>
    </Box>
  );
};

export default PomodoroTimer;