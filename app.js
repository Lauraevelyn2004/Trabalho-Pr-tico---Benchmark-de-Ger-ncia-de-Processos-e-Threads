let singleChartInstance = null;
let batchChartInstance = null;
const QUANTUM = 2;

// Algoritmos disponíveis para seleção (Processos e Threads)
const ALGORITHMS = ['FCFS', 'SJF', 'Prioridade', 'Round Robin', 'Múltiplas Filas'];

// --- CARGAS PREDEFINIDAS PARA A ABA DE COMPARAÇÃO ---
const workload1 = [{"pid":"P1_Longo","arrival_time":0,"cpu_time":50,"priority":3,"threads":[{"tid":"T1","arrival_time":0,"cpu_time":25,"priority":3}, {"tid":"T2","arrival_time":0,"cpu_time":25,"priority":3}]},{"pid":"P2_Curto","arrival_time":1,"cpu_time":2,"priority":1,"threads":[{"tid":"T1","arrival_time":1,"cpu_time":2,"priority":1}]}];
const workload2 = [{"pid":"P1","arrival_time":0,"cpu_time":12,"priority":2,"threads":[{"tid":"T1","arrival_time":0,"cpu_time":4,"priority":2},{"tid":"T2","arrival_time":1,"cpu_time":8,"priority":1}]},{"pid":"P2","arrival_time":1,"cpu_time":15,"priority":1,"threads":[{"tid":"T1","arrival_time":1,"cpu_time":5,"priority":1},{"tid":"T2","arrival_time":2,"cpu_time":10,"priority":3}]}];
const workload3 = [{"pid":"P1","arrival_time":0,"cpu_time":2,"priority":1,"threads":[{"tid":"T1","arrival_time":0,"cpu_time":1,"priority":1},{"tid":"T2","arrival_time":1,"cpu_time":1,"priority":1}]},{"pid":"P2","arrival_time":1,"cpu_time":3,"priority":2,"threads":[{"tid":"T1","arrival_time":1,"cpu_time":2,"priority":2},{"tid":"T2","arrival_time":2,"cpu_time":1,"priority":2}]}];

const batchWorkloads = [
    { name: '1. Efeito Comboio', data: workload1 },
    { name: '2. Alta Concorrência', data: workload2 },
    { name: '3. Micro-operações', data: workload3 }
];

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Inicializa as propriedades de controle (PCB e TCB)
function initializeStructures(processes) {
    let pQueue = JSON.parse(JSON.stringify(processes));
    pQueue.forEach(p => {
        p.state = 'Ready';
        p.remaining_time = p.cpu_time;
        p.threads.forEach(t => {
            t.pid = p.pid;
            t.remaining_time = t.cpu_time;
            t.start_time = -1;
            t.finish_time = 0;
            t.state = 'Ready';
        });
    });
    return pQueue;
}

// Função de ordenação genérica para reaproveitamento
function sortQueue(queue, algorithm) {
    if (algorithm === 'FCFS') queue.sort((a, b) => a.arrival_time - b.arrival_time);
    else if (algorithm === 'SJF') queue.sort((a, b) => a.remaining_time - b.remaining_time);
    else if (algorithm === 'Prioridade') queue.sort((a, b) => a.priority - b.priority);
}

// Escalonador Hierárquico: Seleciona Processo -> Seleciona Thread
function simulateAlgorithm(processes, processAlgo, threadAlgo) {
    let processQueue = initializeStructures(processes);
    let time = 0; 
    let contextSwitches = 0; 
    let completedThreads = [];
    let executionOrder = [];
    let cpuBusyTime = 0;
    
    // Para simplificar a simulação no TP, trataremos FCFS, SJF e Prioridade como Não-Preemptivos.
    // Round Robin e Múltiplas filas possuem lógica preemptiva.
    
    while (processQueue.length > 0) {
        // 1. SELEÇÃO DE PROCESSO
        let availableProcesses = processQueue.filter(p => p.arrival_time <= time);
        
        if (availableProcesses.length === 0) { 
            time++; 
            continue; 
        }

        sortQueue(availableProcesses, processAlgo);
        let selectedProcess = availableProcesses[0];

        // 2. SELEÇÃO DE THREAD (Dentro do processo selecionado)
        let availableThreads = selectedProcess.threads.filter(t => t.arrival_time <= time && t.remaining_time > 0);
        
        if (availableThreads.length === 0) {
            // Se o processo chegou, mas suas threads ainda não (caso raro no JSON, mas seguro prever)
            time++;
            continue;
        }

        sortQueue(availableThreads, threadAlgo);
        let selectedThread = availableThreads[0];
        
        contextSwitches++;
        if (selectedThread.start_time === -1) selectedThread.start_time = time;
        executionOrder.push(`${selectedProcess.pid}(${selectedThread.tid})`);

        // 3. EXECUÇÃO NA CPU
        let execTime = 0;
        if (threadAlgo === 'Round Robin') {
            execTime = Math.min(QUANTUM, selectedThread.remaining_time);
        } else {
            execTime = selectedThread.remaining_time; // Executa até o fim
        }

        time += execTime;
        cpuBusyTime += execTime;
        selectedThread.remaining_time -= execTime;
        selectedProcess.remaining_time -= execTime;

        // 4. VERIFICAÇÃO DE TÉRMINO
        if (selectedThread.remaining_time <= 0) {
            selectedThread.finish_time = time;
            completedThreads.push(selectedThread);
        }

        // Se todas as threads do processo terminaram, remove o processo da fila
        let pendingThreads = selectedProcess.threads.filter(t => t.remaining_time > 0);
        if (pendingThreads.length === 0) {
            processQueue = processQueue.filter(p => p.pid !== selectedProcess.pid);
        }
    }
    
    return { 
        algorithmName: `${processAlgo}/${threadAlgo}`, 
        time, 
        cpuBusyTime,
        contextSwitches, 
        completedThreads, 
        executionOrder 
    };
}

// Cálculo Exato das Métricas Exigidas pelo PDF
function calculateMetrics(simResult, benchmarkTimeMs) {
    let totalWait = 0, totalTurnaround = 0, totalResponse = 0;
    let n = simResult.completedThreads.length;
    
    simResult.completedThreads.forEach(t => {
        let turnaround = t.finish_time - t.arrival_time;
        let response = t.start_time - t.arrival_time;
        let wait = turnaround - t.cpu_time;
        
        totalTurnaround += turnaround;
        totalResponse += response;
        totalWait += wait;
    });

    let cpuUtil = simResult.time > 0 ? (simResult.cpuBusyTime / simResult.time) * 100 : 0;

    return {
        algo: simResult.algorithmName,
        avgWait: (totalWait / n).toFixed(2),
        avgResponse: (totalResponse / n).toFixed(2), // Adicionado
        avgTurnaround: (totalTurnaround / n).toFixed(2),
        throughput: (n / simResult.time).toFixed(4),
        cpuUtilization: cpuUtil.toFixed(2), // Adicionado
        contextSwitches: simResult.contextSwitches,
        totalTime: simResult.time,
        benchmarkTimeMs: benchmarkTimeMs.toFixed(4),
        executionOrder: simResult.executionOrder
    };
}

// --- ABA 1: Lógica Individual ---
function runSingleBenchmark() {
    let data;
    try { data = JSON.parse(document.getElementById('jsonInput').value).processes; } 
    catch (e) { alert("JSON Inválido!"); return; }

    let pathsHTML = '';
    const results = [];
    
    ALGORITHMS.forEach(algo => {
        const startReal = performance.now(); // Medição real do benchmark
        // Simulando a combinação onde Escalonador de Processos e de Threads usam a mesma política
        const simResult = simulateAlgorithm(data, algo, algo);
        const endReal = performance.now();
        
        pathsHTML += `<h4>${algo}</h4><div class="path-container">`;
        pathsHTML += simResult.executionOrder.map(item => `<span class="path-item">${item}</span>`).join(' ➔ ');
        pathsHTML += `</div>`;
        
        results.push(calculateMetrics(simResult, endReal - startReal));
    });
    
    document.getElementById('single-results').style.display = 'block';
    
    const tbody = document.getElementById('singleTableBody');
    tbody.innerHTML = results.map(r => `
        <tr>
            <td><b>${r.algo}</b></td>
            <td>${r.avgWait}</td>
            <td>${r.avgResponse}</td>
            <td>${r.avgTurnaround}</td>
            <td>${r.cpuUtilization}%</td>
            <td>${r.throughput}</td>
            <td>${r.contextSwitches}</td>
            <td>${r.benchmarkTimeMs}</td>
        </tr>`).join('');

    const ctx = document.getElementById('singleChart').getContext('2d');
    if (singleChartInstance) singleChartInstance.destroy();
    
    // Mudança para Gráfico de Linhas conforme o PDF
    singleChartInstance = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: results.map(r => r.algo),
            datasets: [{ 
                label: 'Turnaround Médio (ms)', 
                data: results.map(r => r.avgTurnaround), 
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3 // Deixa a linha suave
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    document.getElementById('executionPathsList').innerHTML = pathsHTML;
}

// --- ABA 2: Lógica em Lote (Comparação) ---
function runBatchComparison() {
    const finalBatchResults = [];

    batchWorkloads.forEach(wl => {
        let wlRow = { workloadName: wl.name, algos: {} };
        ALGORITHMS.forEach(algo => {
            const startReal = performance.now();
            let simResult = simulateAlgorithm(wl.data, algo, algo);
            const endReal = performance.now();
            
            let metrics = calculateMetrics(simResult, endReal - startReal);
            wlRow.algos[algo] = metrics.avgTurnaround;
        });
        finalBatchResults.push(wlRow);
    });

    document.getElementById('batch-results').style.display = 'block';
    
    const tbody = document.getElementById('batchTableBody');
    tbody.innerHTML = finalBatchResults.map(r => `
        <tr>
            <td><b>${r.workloadName}</b></td>
            ${ALGORITHMS.map(a => `<td>${r.algos[a]} ms</td>`).join('')}
        </tr>
    `).join('');

    const ctx = document.getElementById('batchChart').getContext('2d');
    if (batchChartInstance) batchChartInstance.destroy();
    
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22'];
    const datasets = ALGORITHMS.map((algo, index) => {
        return { 
            label: algo, 
            data: finalBatchResults.map(r => r.algos[algo]), 
            borderColor: colors[index],
            backgroundColor: colors[index],
            fill: false,
            tension: 0.3
        };
    });

    // Gráfico de Linhas para a comparação em lote
    batchChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: batchWorkloads.map(wl => wl.name), datasets: datasets },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Turnaround Médio (ms)' } } } }
    });
}