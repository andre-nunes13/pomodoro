import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    xpBlue: {
      100: "#F0F0F0", // Fundo mais claro e sólido, como janelas do XP
      200: "#0052CC", // Azul escuro dos títulos
      300: "#3A8DDE", // Azul claro dos botões
      400: "#A3BFFA", // Destaque suave
    },
    xpGray: {
      100: "#D4D0C8", // Cinza claro do fundo do desktop
      200: "#808080", // Cinza médio das bordas
      300: "#404040", // Cinza escuro para texto
    },
    xpGreen: {
      500: "#008000", // Verde para botões de ação
    },
    xpRed: {
      500: "#FF0000", // Vermelho para botões de erro
    },
    xpYellow: {
      500: "#FFFF00", // Amarelo para destaque
    },
  },
  fonts: {
    body: "MS Sans Serif, sans-serif", // Fonte padrão do XP
    heading: "MS Sans Serif, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)", // Efeito chanfrado 3D
        rounded: "none", // Botões retos
        bg: "xpBlue.300",
        color: "black",
        _hover: {
          bg: "xpBlue.400",
          boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.5)",
        },
        _active: {
          boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    Box: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        bg: "xpBlue.100", // Fundo sólido
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)", // Sombra chanfrada
        opacity: "1", // Remove qualquer transparência
      },
    },
    Input: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        bg: "white",
        boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.2)",
        rounded: "none",
        opacity: "1", // Remove transparência
      },
    },
    Select: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        bg: "white",
        boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.2)",
        rounded: "none",
        opacity: "1", // Remove transparência
      },
    },
    ModalContent: {
      baseStyle: {
        bg: "xpBlue.100", // Fundo sólido do modal
        border: "1px solid",
        borderColor: "xpGray.200",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Sombra mais definida
        opacity: "1", // Remove transparência
      },
    },
    MenuList: {
      baseStyle: {
        bg: "xpBlue.100",
        border: "1px solid",
        borderColor: "xpGray.200",
        boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        opacity: "1", // Remove transparência
      },
    },
    Progress: {
      baseStyle: {
        bg: "xpGray.200",
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)",
        opacity: "1", // Remove transparência
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "xpGray.100",
        color: "xpGray.300",
      },
    },
  },
});

export default customTheme;