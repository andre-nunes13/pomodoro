import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import "./Taskbar.css";

const Taskbar = ({ openApps, onStartClick, onAppClick }) => {
  const [time, setTime] = useState(new Date());
  const [volumeLevel, setVolumeLevel] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleVolumeClick = () => {
    setVolumeLevel((prev) => (prev === 0 ? 50 : 0));
  };

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height="30px"
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
        >
          <Image src="/start-icon.png" alt="Start" w="16px" h="16px" mr={1} />
          Iniciar
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
          fontFamily="'MS Sans Serif', Tahoma, sans-serif"
          fontSize="12px"
        >
          <Box
            bgGradient="linear(to-r, #003087, #0052CC)"
            color="white"
            p={2}
            fontSize="12px"
            fontWeight="bold"
            borderBottom="1px solid"
            borderColor="#808080"
          >
            Windows XP
          </Box>
          <MenuItem
            bg="#ECE9D8"
            _hover={{ bg: "#D4D0C8" }}
            px={2}
            py={1}
          >
            <Image src="/documents-icon.png" alt="Documents" w="16px" h="16px" mr={2} />
            Meus Documentos
          </MenuItem>
          <MenuItem
            bg="#ECE9D8"
            _hover={{ bg: "#D4D0C8" }}
            px={2}
            py={1}
          >
            <Image src="/computer-icon.png" alt="Computer" w="16px" h="16px" mr={2} />
            Meu Computador
          </MenuItem>
          <MenuItem
            bg="#ECE9D8"
            _hover={{ bg: "#D4D0C8" }}
            px={2}
            py={1}
          >
            <Image src="/control-panel-icon.png" alt="Control Panel" w="16px" h="16px" mr={2} />
            Painel de Controle
          </MenuItem>
          <MenuItem
            bg="#ECE9D8"
            _hover={{ bg: "#D4D0C8" }}
            px={2}
            py={1}
          >
            <Image src="/run-icon.png" alt="Run" w="16px" h="16px" mr={2} />
            Executar...
          </MenuItem>
          <MenuItem
            bg="#ECE9D8"
            _hover={{ bg: "#D4D0C8" }}
            px={2}
            py={1}
            color="#C00000"
          >
            <Image src="/power-icon.png" alt="Power" w="16px" h="16px" mr={2} />
            Desligar
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Divisor */}
      <Box w="2px" h="20px" bg="#808080" boxShadow="inset 1px 0 #fff, -1px 0 #808080" mr={1} />

      {/* Lista de Aplicativos Abertos */}
      <Flex flex={1} overflowX="auto" align="center">
        {openApps.map((app) => (
          <Button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            bg="#D4D0C8"
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
            fontFamily="'MS Sans Serif', Tahoma, sans-serif"
          >
            <Image src={app.icon} alt={app.title} w="16px" h="16px" mr={1} />
            <Text isTruncated>{app.title}</Text>
          </Button>
        ))}
      </Flex>

      {/* System Tray */}
      <Flex align="center" bg="#D4D0C8" border="1px solid" borderColor="#808080" boxShadow="inset 1px 1px #fff, inset -1px -1px #808080" px={2} height="24px">
        <Tooltip label="Conexão de Rede" placement="top">
          <IconButton icon={<Image src="/network-icon.png" alt="Network" w="16px" h="16px" />} bg="transparent" size="xs" aria-label="Rede" _hover={{ bg: "#ECE9D8" }} mr={1} />
        </Tooltip>
        <Tooltip label={volumeLevel === 0 ? "Ativar Som" : "Desativar Som"} placement="top">
          <IconButton icon={<Image src={volumeLevel === 0 ? "/volume-muted-icon.png" : "/volume-icon.png"} alt="Volume" w="16px" h="16px" />} bg="transparent" size="xs" aria-label="Volume" _hover={{ bg: "#ECE9D8" }} mr={1} onClick={handleVolumeClick} />
        </Tooltip>
        <Text color="#000000">{formatTime(time)}</Text>
      </Flex>
    </Box>
  );
};

export default Taskbar;
