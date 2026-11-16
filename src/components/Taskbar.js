import React, { useState, useEffect, useContext, useCallback } from "react";
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
    VStack,
    Heading,
    List,
    ListItem,
    ListIcon,
    Link,
    Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, CheckCircleIcon } from "@chakra-ui/icons"; // Adicionei CheckCircleIcon para ícones na lista
import { AppContext } from "../context/AppContext";
import "./Taskbar.css";

const Taskbar = ({ openApps, onStartClick, onAppClick, setIsSettingsOpen }) => {
    const { activeTab, setActiveTab, timeLeft, isRunning, isWorkSession, t } = useContext(AppContext);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [volumeLevel, setVolumeLevel] = useState(50);
    const { isOpen: isVolumeOpen, onOpen: onVolumeOpen, onClose: onVolumeClose } = useDisclosure();
    const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();

    // Atualiza o tempo a cada segundo
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Formata o tempo para HH:MM
    const formatTime = useCallback((date) => {
        return date.toLocaleTimeString(t("language") === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" });
    }, [t]);

    // Formata o tempo do Pomodoro para MM:SS
    const formatPomodoroTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    }, []);

    // Handler para mudança de volume
    const handleVolumeChange = useCallback((value) => {
        setVolumeLevel(value);
    }, []);

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
            role="navigation"
            aria-label={t("Taskbar")}
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
                    aria-label={t("Start Menu")}
                >
                    <Image src="/start-icon.png" alt="" w="16px" h="16px" mr={1} />
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
                        <Image src="/timer-icon.png" alt="" w="16px" h="16px" mr={2} />
                        {t("Timer")}
                    </MenuItem>
                    <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("history")}>
                        <Image src="/history-icon.png" alt="" w="16px" h="16px" mr={2} />
                        {t("History")}
                    </MenuItem>
                    <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("tasks")}>
                        <Image src="/tasks-icon.png" alt="" w="16px" h="16px" mr={2} />
                        {t("Tasks")}
                    </MenuItem>
                    <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setActiveTab("achievements")}>
                        <Image src="/achievements-icon.png" alt="" w="16px" h="16px" mr={2} />
                        {t("Achievements")}
                    </MenuItem>
                    <MenuItem bg="#ECE9D8" _hover={{ bg: "#D4D0C8" }} px={2} py={1} onClick={() => setIsSettingsOpen(true)}>
                        <Image src="/settings-icon.png" alt="" w="16px" h="16px" mr={2} />
                        {t("Settings")}
                    </MenuItem>
                </MenuList>
            </Menu>

            {/* Divisor */}
            <Box w="2px" h="20px" bg="#808080" boxShadow="inset 1px 0 #fff, -1px 0 #808080" mr={1} />

            {/* Lista de Aplicativos Abertos - Desktop */}
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
                        aria-label={t(app.title)}
                    >
                        <Image src={app.icon} alt="" w="16px" h="16px" mr={1} />
                        <Text isTruncated>{t(app.title)}</Text>
                    </Button>
                ))}
            </Flex>

            {/* Menu Hamburguer - Mobile */}
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<HamburgerIcon />}
                    display={{ base: "block", md: "none" }}
                    bg="transparent"
                    color="white"
                    size="sm"
                    aria-label={t("Open Apps")}
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
                            <Image src={app.icon} alt="" w="12px" h="12px" mr={2} />
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
                        icon={<Image src={volumeLevel === 0 ? "/volume-muted-icon.png" : "/volume-icon.png"} alt="" w="16px" h="16px" />}
                        bg="transparent"
                        size="xs"
                        aria-label={volumeLevel === 0 ? t("Unmute") : t("Mute")}
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
                        <Slider
                            value={volumeLevel}
                            onChange={handleVolumeChange}
                            min={0}
                            max={100}
                            step={1}
                            aria-label={t("Volume Slider")}
                        >
                            <SliderTrack bg="xpGray.200">
                                <SliderFilledTrack bg="xpBlue.300" />
                            </SliderTrack>
                            <SliderThumb boxSize={4} bg="xpGray.200" border="1px solid" borderColor="xpGray.200" />
                        </Slider>
                    </Box>
                )}
                <Text color="#000000" fontSize="12px" mr={2}>{formatTime(currentTime)}</Text>
                <Tooltip label={t("Help")} placement="top">
                    <IconButton
                        icon={<Image src="/help-icon.png" alt="" w="16px" h="16px" />}
                        bg="transparent"
                        size="xs"
                        aria-label={t("Help")}
                        _hover={{ bg: "#ECE9D8" }}
                        onClick={onHelpOpen}
                    />
                </Tooltip>
            </Flex>

            {/* Modal de Ajuda Expandido */}
            <Modal isOpen={isHelpOpen} onClose={onHelpClose} size={{ base: "full", md: "xl" }} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent
                    bg="#ECE9D8"
                    border="2px solid"
                    borderColor="#808080"
                    boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
                    fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
                >
                    <ModalHeader
                        bgGradient="linear(to-r, #003087, #0052CC)"
                        color="white"
                        p={2}
                        fontSize="sm"
                        fontWeight="bold"
                        borderBottom="1px solid"
                        borderColor="#808080"
                        boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                    >
                        {t("Help")}
                    </ModalHeader>
                    <ModalCloseButton
                        bg="#C00000"
                        color="white"
                        size="xs"
                        border="1px solid"
                        borderColor="#808080"
                        _hover={{ bg: "#A00000" }}
                        _focus={{ boxShadow: "none" }}
                    />
                    <ModalBody p={4}>
                        <VStack align="start" spacing={6}>
                            {/* Introdução */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Welcome to Focus XP")}</Heading>
                                <Text fontSize="sm">
                                    {t("Focus XP is a productivity tool inspired by the Pomodoro Technique and the retro aesthetics of Windows XP. It helps you manage your time, track tasks, and stay motivated with achievements.")}
                                </Text>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Pomodoro Timer */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Pomodoro Timer")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Break your work into focused intervals (typically 25 minutes) followed by short breaks. After four cycles, enjoy a longer break.")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Start/Pause with the 'Space' key or the play/pause button.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Reset with 'R' or the stop button (disabled in Strict Mode).")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Customize durations in Settings.")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Lista de Tarefas */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Task List")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Organize your tasks with categories, priorities, and AI-generated suggestions.")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Add tasks manually or generate them automatically with AI (requires a topic).")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Edit or delete tasks directly from the list.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Sticky Note displays tasks on your desktop (draggable on desktop).")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Histórico de Sessões */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Session History")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Track your productivity with detailed session logs and visualizations.")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Filter by week, month, or all sessions.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("View a bar chart of session durations.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Export as CSV for external analysis.")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Conquistas */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Achievements")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Earn badges by completing milestones to stay motivated.")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Examples: 'First Steps' (1 cycle), 'Pomodoro Master' (20 cycles).")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Hover over achievements to see descriptions and unlock dates.")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Configurações */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Settings")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Tailor Focus XP to your preferences.")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Adjust work, short break, and long break durations.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Enable Strict Mode to prevent pausing/resetting.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Toggle sound notifications and set custom keyboard shortcuts.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Switch between Portuguese and English.")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Atalhos de Teclado */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Keyboard Shortcuts")}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    {t("Navigate quickly using these default shortcuts (customizable in Settings):")}
                                </Text>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("'T' - Open Timer tab")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("'H' - Open History tab")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("'K' - Open Tasks tab")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("'Space' - Start/Pause Timer")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("'R' - Reset Timer (if not in Strict Mode)")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Dicas */}
                            <Box>
                                <Heading size="md" mb={2}>{t("Tips")}</Heading>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Minimize windows using the taskbar to keep your desktop clean.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Use Strict Mode for uninterrupted focus sessions.")}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="xpGreen.500" />
                                        {t("Check Achievements regularly to track your progress.")}
                                    </ListItem>
                                </List>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* Sobre */}
                            <Box>
                                <Heading size="md" mb={2}>{t("About")}</Heading>
                                <Text fontSize="sm">
                                    {t("Focus XP was created by André as an open-source project. Inspired by Windows XP, it combines nostalgia with modern productivity tools.")}
                                </Text>
                                <Text fontSize="sm" mt={2}>
                                    {t("Contribute or report issues on GitHub:")}
                                    <Link
                                        href="https://github.com/andre-nunes13/pomodoro"
                                        isExternal
                                        ml={1}
                                        color="xpBlue.300"
                                        _hover={{ color: "xpBlue.400", textDecoration: "underline" }}
                                    >
                                        github.com/andre-nunes13/pomodoro
                                    </Link>
                                </Text>
                            </Box>

                            <Divider borderColor="xpGray.200" />

                            {/* FAQ */}
                            <Box>
                                <Heading size="md" mb={2}>{t("FAQ")}</Heading>
                                <List spacing={3}>
                                    <ListItem>
                                        <Text fontWeight="bold" fontSize="sm">{t("How do I change the Pomodoro session length?")}</Text>
                                        <Text fontSize="sm">{t("Go to Settings and adjust the work, short break, and long break durations.")}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text fontWeight="bold" fontSize="sm">{t("Can I export my session history?")}</Text>
                                        <Text fontSize="sm">{t("Yes, export as a CSV file from the Session History tab.")}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text fontWeight="bold" fontSize="sm">{t("Why can't I pause the timer?")}</Text>
                                        <Text fontSize="sm">{t("Strict Mode is enabled. Disable it in Settings to allow pausing and resetting.")}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text fontWeight="bold" fontSize="sm">{t("How do I generate AI tasks?")}</Text>
                                        <Text fontSize="sm">{t("In the Tasks tab, select 'Generate Automatic Tasks', enter a topic, and choose a quantity.")}</Text>
                                    </ListItem>
                                </List>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="#808080" p={2}>
                        <Button
                            size="sm"
                            bg="#C0C0C0"
                            border="1px solid"
                            borderColor="#808080"
                            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                            _hover={{ bg: "#D4D0C8" }}
                            onClick={onHelpClose}
                            aria-label={t("Close Help")}
                        >
                            {t("Close")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Taskbar;