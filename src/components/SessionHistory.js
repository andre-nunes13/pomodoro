// File: /src/components/SessionHistory.js
import React, { useContext, useState } from "react";
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
import { AppContext } from "../context/AppContext";
import { Box, Text, Select, SimpleGrid } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SessionHistory = () => {
  const { sessions } = useContext(AppContext);
  const [filterPeriod, setFilterPeriod] = useState("tudo");

  // Filtra as sessões conforme o período seleccionado
  const now = new Date();
  const filteredSessions = sessions.filter((session) => {
    if (filterPeriod === "tudo") return true;
    const sessionDate = new Date(session.date);
    if (isNaN(sessionDate)) return false;
    if (filterPeriod === "semana") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    }
    if (filterPeriod === "mes") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return sessionDate >= oneMonthAgo;
    }
    return true;
  });

  // Cálculo das estatísticas
  const totalSessions = filteredSessions.length;
  const totalDuration = filteredSessions.reduce((acc, session) => acc + session.duration, 0);
  const averageDuration = totalSessions > 0 ? (totalDuration / totalSessions).toFixed(2) : 0;
  const maxDuration = totalSessions > 0 ? Math.max(...filteredSessions.map(s => s.duration)) : 0;
  const minDuration = totalSessions > 0 ? Math.min(...filteredSessions.map(s => s.duration)) : 0;

  // Dados para o gráfico
  const data = {
    labels: filteredSessions.map((session) => session.date),
    datasets: [
      {
        label: "Tempo Trabalhado (min)",
        data: filteredSessions.map((session) => session.duration),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Histórico de Sessões" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box
      p={6}
      bg="dark.200"
      borderRadius={8}
      boxShadow="md"
      w="100%"
      maxW="800px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Histórico de Sessões
      </Text>

      {/* Seletor de filtro */}
      <Select
        mb={4}
        value={filterPeriod}
        onChange={(e) => setFilterPeriod(e.target.value)}
        bg="white"
        color="black"
      >
        <option value="tudo">Todas as Sessões</option>
        <option value="semana">Última Semana</option>
        <option value="mes">Último Mês</option>
      </Select>

      {filteredSessions.length > 0 ? (
        <>
          <Box mb={6}>
            <Bar data={data} options={options} />
          </Box>

          {/* Estatísticas organizadas num grid responsivo */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Estatísticas
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <Box>
                <Text>N.º Total de Sessões:</Text>
                <Text fontWeight="bold">{totalSessions}</Text>
              </Box>
              <Box>
                <Text>Tempo Total Trabalhado:</Text>
                <Text fontWeight="bold">{totalDuration} min</Text>
              </Box>
              <Box>
                <Text>Duração Média:</Text>
                <Text fontWeight="bold">{averageDuration} min</Text>
              </Box>
              <Box>
                <Text>Duração Máxima:</Text>
                <Text fontWeight="bold">{maxDuration} min</Text>
              </Box>
              <Box>
                <Text>Duração Mínima:</Text>
                <Text fontWeight="bold">{minDuration} min</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </>
      ) : (
        <Text>Nenhuma sessão registada ainda.</Text>
      )}
    </Box>
  );
};

export default SessionHistory;
