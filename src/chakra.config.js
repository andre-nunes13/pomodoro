import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  config: {
    initialColorMode: "dark", // Define o modo escuro como padrão
    useSystemColorMode: false,
  },
  colors: {
    dark: {
      100: "#1a202c", // Cor de fundo principal
      200: "#2d3748", // Cor secundária para painéis
      300: "#4a5568", // Cor de destaque/acento
    },
    blue: {
      500: "#3182ce", // Cor para botões principais
    },
    green: {
      500: "#48bb78", // Cor para botões de ação (ex.: "Adicionar")
    },
    red: {
      500: "#e53e3e", // Cor para botões de erro ou reinício
    },
    yellow: {
      500: "#ecc94b", // Cor para botões de pausa
    },
  },
  fonts: {
    body: "Arial, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "md",
        transition: "all 0.2s",
      },
    },
  },
});

export default customTheme;