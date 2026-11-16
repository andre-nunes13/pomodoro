import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    xpBlue: {
      100: "#ECE9D8", // Fundo claro das janelas XP
      200: "#003087", // Azul escuro da barra de título (início)
      300: "#0052CC", // Azul claro da barra de título (fim)
      400: "#A3BFFA", // Destaque suave
    },
    xpGray: {
      100: "#D4D0C8", // Fundo do desktop XP
      200: "#808080", // Bordas escuras
      300: "#000000", // Texto preto para contraste (usado como fundo padrão para botões inativos)
    },
    xpGreen: {
      500: "#008000", // Verde para ações positivas (Iniciar)
    },
    xpRed: {
      500: "#C00000", // Vermelho do botão fechar e Reiniciar
      600: "#A00000", // Hover do vermelho
    },
    xpYellow: {
      500: "#FFFF00", // Amarelo para Pausar
    },
  },
  fonts: {
    body: '"MS Sans Serif", Tahoma, sans-serif',
    heading: '"MS Sans Serif", Tahoma, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        border: "1px solid",
        borderColor: "xpGray.200",
        boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)",
        bg: "xpGray.300", // Fundo padrão para botões inativos
        color: "white", // Texto branco por padrão (contraste contra xpGray.300)
        fontWeight: "normal",
        rounded: "none",
        _hover: {
          bg: "xpBlue.400", // Hover com azul suave XP
          boxShadow: "inset 1px 1px #fff",
        },
        _active: {
          boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        _disabled: {
          bg: "xpGray.200",
          cursor: "not-allowed",
          color: "xpGray.300",
        },
      },
      variants: {
        active: {
          bg: "xpBlue.100", // Fundo claro para botões ativos
          color: "xpGray.300", // Texto preto para contraste com xpBlue.100
        },
        actionGreen: {
          bg: "xpGreen.500",
          color: "white", // Texto branco para contraste com verde
          _hover: { bg: "#00A000" },
        },
        actionYellow: {
          bg: "xpYellow.500",
          color: "xpGray.300", // Texto preto para contraste com amarelo
          _hover: { bg: "#FFD700" },
        },
        actionRed: {
          bg: "xpRed.500",
          color: "white", // Texto branco para contraste com vermelho
          _hover: { bg: "#FF4040" },
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
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "xpBlue.300",
        },
        track: {
          bg: "xpGray.200",
          boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "xpGray.100",
        color: "xpGray.300",
        fontSize: "13px",
      },
    },
  },
});

export default customTheme;