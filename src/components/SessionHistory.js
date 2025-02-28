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
  const { sessions, setSessions, t } = useContext(AppContext); // Adicionando t ao contexto
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
        label: t("Duration (min)"), // Traduzindo o rótulo do gráfico
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
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: t("Session History") }, // Traduzindo o título do gráfico
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: t("Duration (min)") } }, // Traduzindo eixo Y
      x: { title: { display: true, text: t("Date") } }, // Traduzindo eixo X
    },
  };

  const exportToCSV = () => {
    const headers = `${t("Date")},${t("Duration (min)")},${t("Category")},${t("Type")}\n`; // Traduzindo cabeçalhos do CSV
    const rows = filteredSessions
      .map((s) => `${s.date},${s.duration},${s.category},${t(s.type)}`) // Traduzindo tipo dinamicamente
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
      maxH="600px"
      overflowY="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="xpGray.300">
        {t("Session History")} {/* Traduzindo título */}
      </Text>

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
        <option value="all">{t("All")}</option> {/* Traduzindo opções */}
        <option value="week">{t("Last Week")}</option>
        <option value="month">{t("Last Month")}</option>
      </Select>

      {/* Estatísticas */}
      <Stack spacing={2} mb={4}>
        <Text color="xpGray.300">
          {t("Total Work Hours")}: {totalWorkHours.toFixed(2)} h {/* Traduzindo estatísticas */}
        </Text>
        <Text color="xpGray.300">
          {t("Completed Cycles")}: {totalCycles}
        </Text>
        <Text color="xpGray.300">
          {t("Average Session Duration")}: {avgSessionDuration.toFixed(2)} min
        </Text>
      </Stack>

      {/* Gráfico */}
      <Box mb={6} maxH="300px" overflowY="auto" border="1px solid" borderColor="xpGray.200">
        <Bar data={chartData} options={chartOptions} />
      </Box>

      {/* Tabela */}
      <Box maxH="200px" overflowY="auto" border="1px solid" borderColor="xpGray.200">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="xpBlue.200" zIndex={1}>
            <Tr>
              <Th color="white">{t("Date")}</Th> {/* Traduzindo cabeçalhos da tabela */}
              <Th color="white">{t("Duration (min)")}</Th>
              <Th color="white">{t("Category")}</Th>
              <Th color="white">{t("Type")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSessions.map((session, index) => (
              <Tr key={index}>
                <Td>{session.date}</Td>
                <Td>{session.duration}</Td>
                <Td>{session.category}</Td>
                <Td>{t(session.type)}</Td> {/* Traduzindo tipo dinamicamente */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Botões */}
      <Stack direction="row" spacing={4} mt={4}>
        <Button
          onClick={exportToCSV}
          bg="xpBlue.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "xpBlue.400" }}
          isDisabled={filteredSessions.length === 0}
        >
          {t("Export as CSV")} {/* Traduzindo botão */}
        </Button>
        <Button
          onClick={clearHistory}
          bg="xpRed.500"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#FF4040" }}
          isDisabled={filteredSessions.length === 0}
        >
          {t("Clear History")} {/* Traduzindo botão */}
        </Button>
      </Stack>
    </Box>
  );
};

export default SessionHistory;