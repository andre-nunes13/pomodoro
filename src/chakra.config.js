import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    xpBlue: {
      100: "#ECE9D8", // Fundo claro das janelas
      200: "#003087", // Azul escuro da barra de título
      300: "#C0C0C0", // Cinza claro dos botões inativos
      400: "#A3BFFA", // Azul suave para destaques
    },
    xpGray: {
      100: "#D4D0C8", // Cinza do fundo do desktop
      200: "#808080", // Cinza médio das bordas
      300: "#404040", // Cinza escuro para texto
    },
    xpGreen: {
      500: "#008000", // Verde para ações
    },
    xpRed: {
      500: "#C00000", // Vermelho escuro dos botões de fechar
      600: "#A00000", // Hover do vermelho
    },
    xpYellow: {
      500: "#FFFF00", // Amarelo para destaque
    },
  },
  fonts: {
    body: "MS Sans Serif, Tahoma, sans-serif",
    heading: "MS Sans Serif, Tahoma, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)", // Efeito 3D
        rounded: "none", // Sem bordas arredondadas
        bg: "xpBlue.300",
        color: "black",
        fontWeight: "normal",
        _hover: {
          bg: "xpBlue.400",
          boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.5)",
        },
        _active: {
          boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    Box: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        bg: "xpBlue.100",
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)",
      },
    },
    Input: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        bg: "white",
        boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.2)",
        rounded: "none",
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