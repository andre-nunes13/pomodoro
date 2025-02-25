import csv
import random

# Lista de temas variados
temas = [
    "Fotossíntese", "Revolução Francesa", "Eletricidade e Magnetismo", "Teorema de Pitágoras", "DNA e Genética",
    "Expansão Marítima Portuguesa", "Reações Químicas", "O Sistema Solar", "Cálculo Diferencial", "Energia Nuclear",
    "Grandes Descobrimentos", "Era Digital e IA", "Geometria Fractal", "O Ciclo da Água", "História da Computação",
    "Segunda Guerra Mundial", "Neurociência", "Big Bang e a Origem do Universo", "Programação em Python", "Mecânica Quântica",
    "Filósofos Gregos", "Literatura Clássica", "Arte Renascentista", "Economia Sustentável", "Ecossistemas Marinhos",
    "Evolução das Espécies", "Matemática na Música", "História da Medicina", "Teoria da Relatividade", "Física de Partículas",
    "Redes Neurais Artificiais", "Teorema de Euler", "Cultura Romana", "Arquitetura Gótica", "Astronomia Observacional",
    "Impacto das Redes Sociais", "Linguística e Origem das Línguas", "Criatividade e Inovação", "Ética na Inteligência Artificial",
    "Blockchain e Criptomoedas", "Realidade Virtual e Aumentada", "Mitologia Nórdica", "Política Internacional",
    "História da Música Clássica", "Psicologia Comportamental", "Robótica e Automação", "Engenharia Aeroespacial",
    "Geopolítica e Conflitos Mundiais", "Desenvolvimento Sustentável", "Direitos Humanos", "Bioética",
]

# Lista expandida de tarefas (50+ exemplos)
tarefas_templates = [
    "Cria um mapa mental sobre {tema} com pelo menos 5 tópicos principais.",
    "Faz um debate com um amigo sobre {tema} e anota os pontos principais.",
    "Escreve um ensaio sobre como {tema} influencia a sociedade atual.",
    "Pesquisa e resume um artigo científico sobre {tema}.",
    "Desenha um infográfico para explicar {tema} de forma visual.",
    "Cria um quiz de 10 perguntas sobre {tema} e testa os teus amigos.",
    "Encontra um documentário sobre {tema} e faz um resumo dos pontos principais.",
    "Escreve uma história fictícia onde {tema} desempenha um papel crucial.",
    "Faz um pequeno vídeo explicando {tema} como se fosses um professor.",
    "Pesquisa como {tema} está ligado a outra área do conhecimento e explica a conexão.",
    "Escreve um argumento defendendo e outro contra {tema}.",
    "Cria um jogo de cartas onde cada carta tem um conceito sobre {tema}.",
    "Descobre uma inovação recente relacionada a {tema} e explica como funciona.",
    "Imagina que vives num mundo sem {tema}. Como seria o impacto na tua vida?",
    "Cria um diário de estudo para aprender sobre {tema} em 5 dias.",
    "Desenvolve um podcast curto sobre {tema} e partilha com colegas.",
    "Cria uma apresentação em PowerPoint sobre os conceitos principais de {tema}.",
    "Escreve um poema ou música sobre {tema}.",
    "Faz um jogo de perguntas e respostas sobre {tema} para testar os teus conhecimentos.",
    "Elabora um plano de aula sobre {tema} para ensinar a um aluno do 9º ano.",
    "Pesquisa sobre as aplicações modernas de {tema} na tecnologia.",
    "Cria um website simples que explique {tema} para iniciantes.",
    "Desenha um cartaz explicativo sobre {tema} e coloca na tua escola.",
    "Cria um TikTok educativo explicando um conceito de {tema} de forma criativa.",
    "Faz uma comparação entre {tema} e um conceito semelhante de outra área.",
    "Descobre 3 mitos sobre {tema} e desmistifica-os com base científica.",
    "Explica {tema} em apenas 5 frases para um amigo que nunca ouviu falar sobre isso.",
    "Cria um jogo de tabuleiro onde {tema} é a base da mecânica do jogo.",
    "Faz uma simulação real ou virtual de um fenómeno relacionado a {tema}.",
    "Escreve um discurso político que mencione a importância de {tema}.",
    "Pesquisa como {tema} é abordado em diferentes culturas e países.",
    "Faz um diagrama ilustrado detalhando o funcionamento de {tema}.",
    "Escreve um guião para um vídeo de YouTube educativo sobre {tema}.",
    "Cria um diário fictício de alguém que viveu um evento histórico ligado a {tema}.",
    "Desenha uma linha do tempo dos eventos mais importantes de {tema}.",
    "Cria um enigma ou puzzle matemático baseado em {tema}.",
    "Escreve um código de programação simples que ilustre um conceito de {tema}.",
    "Desenvolve uma app ou jogo educativo para ensinar sobre {tema}.",
    "Faz um estudo estatístico e analisa gráficos sobre {tema}.",
    "Cria uma experiência científica para demonstrar um princípio de {tema}.",
    "Elabora um relatório sobre os desafios futuros relacionados com {tema}.",
    "Cria um guia de estudo com resumos, exercícios e dicas sobre {tema}.",
    "Escreve um artigo de opinião sobre a importância de {tema} na sociedade.",
    "Encontra e analisa um caso real que envolva {tema}.",
    "Elabora um workshop educativo prático sobre {tema}.",
    "Cria um desafio de 30 dias para aprender algo novo sobre {tema} todos os dias.",
    "Faz uma entrevista com um especialista na área de {tema} e resume os pontos-chave.",
]

# Criar ficheiro CSV com 1500 exemplos
with open("dataset_tarefas_estudo_1500.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Tema", "Tarefas"])  # Cabeçalhos

    for _ in range(1500):
        tema = random.choice(temas)
        tarefas = "; ".join(random.sample(tarefas_templates, 6))  # Escolhe 6 tarefas únicas
        writer.writerow([tema, tarefas])

print("Ficheiro dataset_tarefas_estudo_1500.csv gerado com sucesso!")
