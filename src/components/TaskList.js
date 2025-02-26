import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Input,
  Button,
  Stack,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TaskList = () => {
  const { tasks, setTasks } = useContext(AppContext);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [taskCategory, setTaskCategory] = useState("Estudo");
  const [taskPriority, setTaskPriority] = useState("Média");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generateTopic, setGenerateTopic] = useState("");
  const [generateQuantity, setGenerateQuantity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Inicialize o Gemini API com a chave do ambiente
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use o modelo correto

  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("Chave de API do Gemini não configurada. Configure REACT_APP_GEMINI_API_KEY no seu arquivo .env.");
    }
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: Date.now(),
          description: newTask,
          completed: false,
          category: taskCategory,
          priority: taskPriority,
          dueDate: null,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.description);
  };

  const saveEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: editText } : task
      )
    );
    setEditingTask(null);
    setEditText("");
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const generateTasks = async () => {
    if (!generateTopic.trim() || !generateQuantity) {
      alert("Por favor, insira um tema e selecione a quantidade de tarefas.");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Cria exatamente ${generateQuantity} tarefas detalhadas para estudar sobre o seguinte tema: "${generateTopic}". As tarefas devem ser numeradas de 1 a ${generateQuantity}, focadas e específicas. Não deves incluir texto extra, apenas as ${generateQuantity} tarefas numeradas. Exemplo: 1. Resolver 10 exercícios de tal matéria 2. Estudar 30 minutos sobre funções exponenciais APENAS ESCREVE AS TAREFAS E NADA ALÉM DISSO`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Processar o texto retornado para extrair as tarefas
      const tasksArray = responseText
        .split("\n")
        .filter((line) => line.trim() && line.match(/^\d+\.\s/)) // Filtra linhas numeradas
        .map((line) => line.trim());

      const generatedTasks = tasksArray.map((task, index) => ({
        id: Date.now() + index,
        description: task,
        completed: false,
        category: "Estudo",
        dueDate: null,
        priority: "Média",
      }));

      setTasks([...tasks, ...generatedTasks]);
      setIsGenerateOpen(false);
      setGenerateTopic("");
      setGenerateQuantity(5);
    } catch (error) {
      console.error("Erro ao gerar tarefas com o Gemini:", error);
      alert("Ocorreu um erro ao gerar as tarefas. Verifique a chave de API ou o tema.");
      // Fallback mock
      const mockTasks = Array.from({ length: generateQuantity }, (_, i) => ({
        id: Date.now() + i,
        description: `${i + 1}. Tarefa sobre ${generateTopic}`,
        completed: false,
        category: "Estudo",
        dueDate: null,
        priority: "Média",
      }));
      setTasks([...tasks, ...mockTasks]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box p={6} bg="xpBlue.100" borderRadius={0} boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Lista de Tarefas
        </Text>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<AddIcon />}
            variant="outline"
            border="1px solid"
            borderColor="xpGray.200"
            bg="xpBlue.300"
            color="black"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "xpBlue.400" }}
            aria-label="Gerar Tarefas"
            isDisabled={isLoading}
          />
          <MenuList bg="xpBlue.100" borderColor="xpGray.200" boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
            <MenuItem onClick={() => setIsGenerateOpen(true)} bg="xpBlue.100" isDisabled={isLoading}>
              Gerar Tarefas Automáticas
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
      <Stack direction="row" mb={4} spacing={2}>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa"
          bg="white"
          color="xpGray.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
          flex={1}
          isDisabled={isLoading}
        />
        <Select
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
          bg="white"
          color="xpGray.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
          w="150px"
          isDisabled={isLoading}
        >
          <option value="Estudo">Estudo</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Lazer">Lazer</option>
        </Select>
        <Select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          bg="white"
          color="xpGray.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
          w="150px"
          isDisabled={isLoading}
        >
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </Select>
        <Button
          onClick={addTask}
          colorScheme="green"
          bg="xpGreen.500"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#00A000" }}
          isDisabled={isLoading}
        >
          Adicionar
        </Button>
      </Stack>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            alignItems="center"
            p={2}
            bg="xpBlue.100"
            border="1px solid"
            borderColor="xpGray.200"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          >
            <Checkbox
              isChecked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              mr={2}
              borderColor="xpGray.200"
              bg="xpBlue.100"
              isDisabled={isLoading}
            />
            {editingTask === task.id ? (
              <Stack direction="row" flex={1}>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  flex={1}
                  isDisabled={isLoading}
                />
                <Button
                  onClick={() => saveEdit(task.id)}
                  colorScheme="blue"
                  bg="xpBlue.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                  size="sm"
                  _hover={{ bg: "xpBlue.400" }}
                  isDisabled={isLoading}
                >
                  Salvar
                </Button>
              </Stack>
            ) : (
              <Text flex={1} className={task.completed ? "line-through text-gray-500" : ""}>
                {task.description} (Cat: {task.category}, Pri: {task.priority})
              </Text>
            )}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<EditIcon />}
                variant="ghost"
                bg="xpBlue.100"
                border="1px solid"
                borderColor="xpGray.200"
                boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                isDisabled={isLoading}
              />
              <MenuList bg="xpBlue.100" borderColor="xpGray.200" boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
                <MenuItem onClick={() => editTask(task)} bg="xpBlue.100" icon={<EditIcon />} isDisabled={isLoading}>
                  Editar
                </MenuItem>
                <MenuItem
                  onClick={() => deleteTask(task.id)}
                  bg="xpBlue.100"
                  icon={<DeleteIcon />}
                  color="xpRed.500"
                  isDisabled={isLoading}
                >
                  Excluir
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ))}
      </Stack>

      {/* Modal para Gerar Tarefas Automáticas */}
      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
          <ModalHeader bg="xpBlue.200" color="white" borderBottom="1px solid" borderColor="xpGray.200">
            Gerar Tarefas Automáticas
          </ModalHeader>
          <ModalCloseButton color="white" isDisabled={isLoading} />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <Text mb={2}>Tema:</Text>
                <Input
                  value={generateTopic}
                  onChange={(e) => setGenerateTopic(e.target.value)}
                  placeholder="Digite o tema (ex.: Matemática)"
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                />
              </Box>
              <Box>
                <Text mb={2}>Quantidade de Tarefas:</Text>
                <Select
                  value={generateQuantity}
                  onChange={(e) => setGenerateQuantity(parseInt(e.target.value))}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                </Select>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={generateTasks}
              colorScheme="blue"
              bg="xpBlue.300"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "xpBlue.400" }}
              isLoading={isLoading}
              loadingText="Gerando..."
            >
              Gerar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskList;