# 🖥️ Trabalho Prático – Benchmark de Gerência de Processos e Threads

Simulador desenvolvido para a disciplina de **Sistemas Operacionais I** do curso de **Ciência da Computação** do **IFSULDEMINAS – Campus Machado**.

O projeto implementa um ambiente de simulação para análise e comparação de algoritmos de escalonamento de processos e threads, utilizando as estruturas **PCB (Process Control Block)** e **TCB (Thread Control Block)**. O objetivo é demonstrar o comportamento de diferentes políticas de escalonamento por meio de benchmarks e gráficos comparativos.

---

## Objetivos

* Simular o gerenciamento de processos e threads em dois níveis.
* Comparar o desempenho de diferentes algoritmos de escalonamento.
* Apresentar métricas de execução de forma visual.
* Facilitar o estudo dos conceitos de Sistemas Operacionais.

---

## Funcionalidades

O simulador permite:

* ✔️ Criação de processos contendo múltiplas threads.
* ✔️ Simulação do escalonamento em dois níveis (Processo → Thread).
* ✔️ Execução dos seguintes algoritmos:

  * FCFS (First-Come, First-Served)
  * SJF (Shortest Job First)
  * Prioridade
  * Round Robin (Quantum configurável)
  * Múltiplas Filas
* ✔️ Comparação entre os algoritmos.
* ✔️ Visualização gráfica dos resultados.
* ✔️ Importação de cargas de trabalho em formato JSON.

---

## Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**
* **Chart.js** (visualização dos gráficos)
* **Visual Studio Code**
* **Live Server**

---

## Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/Lauraevelyn2004/Trabalho-Pr-tico---Benchmark-de-Ger-ncia-de-Processos-e-Threads.git
```

### 2. Abra o projeto

Abra a pasta do projeto no **Visual Studio Code**.

### 3. Instale a extensão Live Server

Caso ainda não possua, instale a extensão **Live Server** no VS Code.

### 4. Execute

Clique com o botão direito no arquivo **index.html** e selecione:

```
Open with Live Server
```

O sistema será aberto automaticamente no navegador.

---

##  Estrutura do Projeto

```
📁 Trabalho-Prático---Benchmark-de-Gerência-de-Processos-e-Threads
│
├── css/
├── js/
├── imagens/
├── index.html
├── README.md
└── Trabalho Prático SO.pdf
```

---

## 📊 Algoritmos Implementados

### FCFS (First-Come, First-Served)

Executa os processos conforme a ordem de chegada.

### SJF (Shortest Job First)

Prioriza os processos com menor tempo de execução.

### Prioridade

Seleciona primeiro os processos com maior prioridade.

### Round Robin

Distribui o tempo de CPU igualmente entre os processos utilizando um quantum configurável.

### Múltiplas Filas

Organiza os processos em diferentes filas conforme suas características e prioridades.

---

##  Cargas de Teste

O simulador aceita cargas em formato **JSON**, permitindo configurar:

* Processos
* Threads
* Tempo de chegada
* Tempo de CPU
* Prioridade

Exemplos disponíveis no sistema:

* 🚦 Efeito Comboio
* ⚡ Alta Concorrência
* 🔬 Micro-operações

---

## 📈 Resultados

Após a execução da simulação, o sistema apresenta:

* Tempo médio de espera
* Tempo médio de retorno
* Tempo médio de resposta
* Comparação entre algoritmos
* Gráficos interativos para análise dos resultados

---

## 📄 Relatório Técnico

O relatório completo contendo:

* Fundamentação teórica
* Estruturas PCB e TCB
* Descrição dos algoritmos
* Metodologia
* Resultados obtidos
* Conclusões

está disponível no arquivo:

```
Trabalho Prático SO.pdf
```

---

## 👩‍💻 Desenvolvedoras

**Laura Evelyn Neves Oliveira**

**Amanda Dias Alves Ferreira**

---

##  Disciplina

**Sistemas Operacionais I**

**Professor:** Renan

**IFSULDEMINAS – Campus Machado**

---

## 📅 Data de Entrega

**03/07/2026**

---

## 📜 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como trabalho da disciplina de Sistemas Operacionais I.
