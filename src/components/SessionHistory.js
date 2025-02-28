import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Stack,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SessionHistory = () => {
  const { sessions, setSessions } = useContext(AppContext);
  const [filter, setFilter] = useState("all");

  const filterSessions = () => {
    const now = new Date();
    switch (filter) {
      case "week":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return (now - sessionDate) / (1000 * 60 * 60 * 24) <= 7;
        });
      case "month":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return (now - sessionDate) / (1000 * 60 * 60 * 24) <= 30;
        });
      default:
        return sessions;
    }
  };

  const filteredSessions = filterSessions();

  // Estatísticas
  const totalWorkHours = filteredSessions
    .filter((s) => s.type === "Trabalho")
    .reduce((acc, session) => acc + session.duration / 60, 0);
  const totalCycles = filteredSessions.filter((s) => s.type === "Trabalho").length;
  const avgSessionDuration = filteredSessions.length
    ? filteredSessions.reduce((acc, s) => acc + s.duration, 0) / filteredSessions.length / 60
    : 0;

  // Dados para o gráfico
  const chartData = {
    labels: filteredSessions.map((s) => s.date),
    datasets: [
      {
        label: "Duração (min)",
        data: filteredSessions.map((s) => s.duration),
        backgroundColor: filteredSessions.map((s) =>
          s.type === "Trabalho" ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: filteredSessions.map((s) =>
          s.type === "Trabalho" ? "rgba(54, 162, 235, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Histórico de Sessões" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Duração (min)" } },
      x: { title: { display: true, text: "Data" } },
    },
  };

  const exportToCSV = () => {
    const headers = "Data,Duração (min),Categoria,Tipo\n";
    const rows = filteredSessions
      .map((s) => `${s.date},${s.duration},${s.category},${s.type}`)
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "session_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    setSessions([]);
    localStorage.setItem("sessions", JSON.stringify([]));
  };

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      border="1px solid"
      borderColor="xpGray.200"
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
      h="calc(100vh - 30px)" // Altura total menos a Taskbar
      maxH="calc(100vh - 30px)"
      w={{ base: "100%", md: "80vw", lg: "60vw" }} // Largura responsiva: 100% em mobile, 80% em médio, 60% em grande
      maxW="800px" // Largura máxima fixa
      overflowY="auto"
      position="relative"
      mx="auto" // Centraliza horizontalmente
    >
      {/* Filtro */}
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        mb={4}
        bg="white"
        color="xpGray.300"
        border="1px solid"
        borderColor="xpGray.200"
        boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
        maxW="200px"
      >
        <option value="all">Todos</option>
        <option value="week">Última Semana</option>
        <option value="month">Último Mês</option>
      </Select>

      {/* Estatísticas */}
      <Stack spacing={2} mb={4}>
        <Text color="xpGray.300">Total de Horas Trabalhadas: {totalWorkHours.toFixed(2)} h</Text>
        <Text color="xpGray.300">Ciclos Concluídos: {totalCycles}</Text>
        <Text color="xpGray.300">Duração Média por Sessão: {avgSessionDuration.toFixed(2)} min</Text>
      </Stack>

      {/* Gráfico */}
      <Box
        mb={4}
        h="40vh"
        maxH="40vh"
        overflowY="auto"
        border="1px solid"
        borderColor="xpGray.200"
      >
        <Bar data={chartData} options={chartOptions} />
      </Box>

      {/* Tabela */}
      <Box
        h="40vh"
        maxH="40vh"
        overflowY="auto"
        border="1px solid"
        borderColor="xpGray.200"
        mb={16} // Espaço extra para os botões (maior que a altura dos botões + margem)
      >
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="xpBlue.200" zIndex={1}>
            <Tr>
              <Th color="white">Data</Th>
              <Th color="white">Duração (min)</Th>
              <Th color="white">Categoria</Th>
              <Th color="white">Tipo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSessions.map((session, index) => (
              <Tr key={index}>
                <Td>{session.date}</Td>
                <Td>{session.duration}</Td>
                <Td>{session.category}</Td>
                <Td>{session.type}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Botões */}
      <Stack
        direction="row"
        spacing={4}
        position="absolute" // Posicionamento absoluto para evitar sobreposição
        bottom={4} // Ajustado para ficar acima da Taskbar
        left="50%"
        transform="translateX(-50%)" // Centraliza horizontalmente
        zIndex={2}
      >
        <Button
          onClick={exportToCSV}
          bg="xpBlue.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "xpBlue.400" }}
          isDisabled={filteredSessions.length === 0}
          size="sm" // Reduz o tamanho para melhor ajuste
        >
          Exportar como CSV
        </Button>
        <Button
          onClick={clearHistory}
          bg="xpRed.500"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#FF4040" }}
          isDisabled={filteredSessions.length === 0}
          size="sm" // Reduz o tamanho
        >
          Limpar Histórico
        </Button>
      </Stack>
    </Box>
  );
};

export default SessionHistory;