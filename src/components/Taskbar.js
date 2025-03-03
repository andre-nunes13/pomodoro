import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons"; // Corrigido aqui
import { AppContext } from "../context/AppContext";
import "./Taskbar.css";

const Taskbar = ({ openApps, onStartClick, onAppClick, setIsSettingsOpen }) => {
  const { activeTab, setActiveTab, timeLeft, isRunning, isWorkSession, t } = useContext(AppContext);
  const [time, setTime] = useState(new Date());
  const [volumeLevel, setVolumeLevel] = useState(50);
  const { isOpen: isVolumeOpen, onOpen: onVolumeOpen, onClose: onVolumeClose } = useDisclosure();
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      if (newTime.getSeconds() !== time.getSeconds()) setTime(newTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const formatTime = (date) => date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const formatPomodoroTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };
  const handleVolumeChange = (value) => setVolumeLevel(value);

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height={{ base: "40px", md: "30px" }}
      bgGradient="linear(to-r, #003087, #0052CC)"
      borderTop="1px solid"
      borderColor="#808080"
      boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
      display="flex"
      alignItems="center"
      px={1}
      zIndex={10}
    >
      {/* Botão Iniciar com Menu */}
      <Menu>
        <MenuButton
          as={Button}
          bg="#008000"
          color="white"
          fontWeight="bold"
          fontSize="12px"
          height="24px"
          minW="60px"
          border="1px solid"
          borderColor="#808080"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#006400" }}
          _active={{ boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          display="flex"
          alignItems="center"
          mr={1}
          onClick={onStartClick}
          aria-label="Start Menu"
        >
          <Image src="/start-icon.png" alt="Start" w="16px" h="16px" mr={1} />
          {t("Start")}
        </MenuButton>
        <MenuList
          bg="#ECE9D8"
          border="1px solid"
          borderColor="#808080"
          boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
          minW="220px"
          p={0}
          bottom="30px"
          left="1px"
          fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
          fontSize="12px"
        >
          <Box bgGradient="linear(to-r, #003087, #0052CC)" color="white" p={2} fontSize="12px" fontWeight="bold" borderBottom="1px solid" borderColor="#808080">
            Focus XP
          </Box>
          <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("timer")}>
            <Image src="/timer-icon.png" alt="Timer" w="16px" h="16px" mr={2} />
            {t("Timer")}
          </MenuItem>
          <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("history")}>
            <Image src="/history-icon.png" alt="History" w="16px" h="16px" mr={2} />
            {t("History")}
          </MenuItem>
          <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("tasks")}>
            <Image src="/tasks-icon.png" alt="Tasks" w="16px" h="16px" mr={2} />
            {t("Tasks")}
          </MenuItem>
          <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("achievements")}>
            <Image src="/achievements-icon.png" alt="Achievements" w="16px" h="16px" mr={2} />
            {t("Achievements")}
          </MenuItem>
          <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setIsSettingsOpen(true)}>
            <Image src="/settings-icon.png" alt="Settings" w="16px" h="16px" mr={2} />
            {t("Settings")}
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Divisor */}
      <Box w="2px" h="20px" bg="#808080" boxShadow="inset 1px 0 #fff, -1px 0 #808080" mr={1} />

      {/* Lista de Aplicativos Abertos - Desktop (padrão) */}
      <Flex display={{ base: "none", md: "flex" }} flex={1} overflowX="auto" align="center">
        {openApps.map((app) => (
          <Button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            bg={activeTab === app.id ? "#ECE9D8" : "#D4D0C8"}
            color="#000000"
            fontSize="12px"
            height="24px"
            minW="150px"
            maxW="200px"
            border="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "#ECE9D8" }}
            _active={{ boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            mx={1}
            display="flex"
            alignItems="center"
            fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
          >
            <Image src={app.icon} alt={app.title} w="16px" h="16px" mr={1} />
            <Text isTruncated>{t(app.title)}</Text>
          </Button>
        ))}
      </Flex>

      {/* Menu Hamburguer - Apenas Mobile */}
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon />}
          display={{ base: "block", md: "none" }}
          bg="transparent"
          color="white"
          size="sm"
          aria-label="Open Apps"
          mr={1}
        />
        <MenuList
          bg="#ECE9D8"
          border="1px solid"
          borderColor="#808080"
          boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
          minW="180px"
          p={0}
          bottom="40px"
          fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
          fontSize="10px"
        >
          {openApps.map((app) => (
            <MenuItem key={app.id} bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => onAppClick(app.id)}>
              <Image src={app.icon} alt={app.title} w="12px" h="12px" mr={2} />
              {t(app.title)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {/* System Tray */}
      <Flex align="center" bg="#D4D0C8" border="1px solid" borderColor="#808080" boxShadow="inset 1px 1px #fff, inset -1px -1px #808080" px={2} height="24px" ml="auto">
        <Tooltip label={isWorkSession ? t("Work") : t("Break")} placement="top">
          <Text fontSize="12px" color={isRunning ? (isWorkSession ? "#008000" : "#FF0000") : "#000000"} mr={2}>
            {formatPomodoroTime(timeLeft)}
          </Text>
        </Tooltip>
        <Tooltip label={volumeLevel === 0 ? t("Unmute") : t("Mute")} placement="top">
          <IconButton
            icon={<Image src={volumeLevel === 0 ? "/volume-muted-icon.png" : "/volume-icon.png"} alt="Volume" w="16px" h="16px" />}
            bg="transparent"
            size="xs"
            aria-label={volumeLevel === 0 ? "Unmute" : "Mute"}
            _hover={{ bg: "#ECE9D8" }}
            mr={1}
            onClick={onVolumeOpen}
          />
        </Tooltip>
        {isVolumeOpen && (
          <Box
            position="absolute"
            bottom="30px"
            right="50px"
            bg="#ECE9D8"
            border="1px solid"
            borderColor="#808080"
            boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
            p={2}
            w="150px"
            onMouseLeave={onVolumeClose}
          >
            <Slider value={volumeLevel} onChange={handleVolumeChange} min={0} max={100} step={1}>
              <SliderTrack bg="xpGray.200">
                <SliderFilledTrack bg="xpBlue.300" />
              </SliderTrack>
              <SliderThumb boxSize={4} bg="xpGray.200" border="1px solid" borderColor="xpGray.200" />
            </Slider>
          </Box>
        )}
        <Text color="#000000" fontSize="12px">{formatTime(time)}</Text>
        <Tooltip label={t("Help")} placement="top">
          <IconButton
            icon={<Image src="/help-icon.png" alt="Help" w="16px" h="16px" />}
            bg="transparent"
            size="xs"
            aria-label="Help"
            _hover={{ bg: "#ECE9D8" }}
            ml={2}
            onClick={onHelpOpen}
          />
        </Tooltip>
      </Flex>

      <Modal isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Help")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t("Here you can find some helpful information...")}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onHelpClose}>{t("Close")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Taskbar;