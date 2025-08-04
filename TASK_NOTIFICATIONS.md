# Sistema de Notificações de Tarefas - TodoChat

## Visão Geral

O sistema de notificações de tarefas foi implementado para melhorar a comunicação e acompanhamento de tarefas designadas. Quando alguém é "nudged" (cutucado) sobre uma mensagem, o sistema agora detecta automaticamente se a mensagem está relacionada a tarefas e envia notificações específicas por e-mail.

## Funcionalidades Implementadas

### 1. Detecção Inteligente de Tarefas

O sistema agora detecta automaticamente quando uma mensagem está relacionada a tarefas através de:

- **Palavras-chave**: "tarefa", "task", "responsável", "assign", "deadline", "prazo", "concluir", "complete"
- **Relacionamento com tarefas**: Se o autor da mensagem tem tarefas designadas
- **Tarefas em atraso**: Se o usuário tem tarefas com prazo vencido

### 2. Tipos de Notificação por E-mail

#### Notificação Geral de Nudge

- Enviada quando alguém é nudged sobre qualquer mensagem
- Design visual com gradiente roxo/rosa
- Inclui link direto para a mensagem

#### Notificação Específica de Tarefa

- Enviada quando o nudge está relacionado a tarefas
- Design visual com gradiente amarelo/vermelho
- Inclui informações sobre a tarefa relacionada
- Links diretos para a mensagem e para a tarefa

#### Notificação de Tarefas em Atraso

- Enviada automaticamente quando há tarefas vencidas
- Lista todas as tarefas em atraso com prioridades
- Design visual com gradiente vermelho
- Inclui datas de vencimento e prioridades

### 3. Componente de Visualização de Tarefas

Foi criado o componente `UserTasksPanel` que permite aos usuários:

- Visualizar todas as suas tarefas designadas
- Filtrar por status (Todas, A Fazer, Em Progresso, Concluídas)
- Ver tarefas em atraso destacadas
- Visualizar prioridades e datas de vencimento

## Como Usar

### Para Usuários Recebendo Notificações

1. **Notificações Automáticas**: Quando alguém nudged você sobre uma mensagem relacionada a tarefas, você receberá automaticamente um e-mail específico
2. **Notificações de Tarefas Designadas**: Se você foi designado para uma tarefa e o criador nudged sua própria mensagem, você receberá a notificação
3. **Visualização de Tarefas**: Use o componente `UserTasksPanel` para ver todas as suas tarefas
4. **Tarefas em Atraso**: Tarefas vencidas são destacadas em vermelho

### Comportamento do Self-Nudge

Quando você nudged sua própria mensagem:

- O sistema busca tarefas que você criou
- Identifica a tarefa mais recente
- Envia notificação para o usuário designado para essa tarefa
- Inclui informações sobre tarefas em atraso do responsável

### Para Usuários Enviando Nudges

1. **Nudge Regular**: Clique no ícone de sino em qualquer mensagem
2. **Nudge Própria Mensagem**: Você pode nudged sua própria mensagem para notificar o responsável pela tarefa
3. **Detecção Automática**: O sistema detecta automaticamente se a mensagem está relacionada a tarefas
4. **Notificação Inteligente**: A pessoa responsável receberá uma notificação específica baseada no contexto

## Estrutura dos E-mails

### E-mail de Tarefa Específica

```
📋 [Nome] is calling you about a task on TodoChat

- Seção destacada com informações da tarefa
- Conteúdo da mensagem original
- Links para visualizar a mensagem e a tarefa
- Design responsivo e profissional
```

### E-mail de Tarefas em Atraso

```
⏰ You have X overdue tasks on TodoChat

- Lista detalhada de todas as tarefas em atraso
- Prioridades destacadas por cores
- Datas de vencimento
- Link para visualizar todas as tarefas
```

## Configuração Técnica

### Funções Convex Implementadas

1. **`sendTaskNudgeEmail`**: Envia notificação específica sobre tarefas
2. **`sendOverdueTaskReminder`**: Envia notificação sobre tarefas em atraso
3. **`getTasksForUser`**: Busca tarefas de um usuário específico
4. **`getOverdueTasks`**: Busca tarefas em atraso
5. **`sendOverdueTaskNotification`**: Função para enviar notificações de tarefas em atraso

### Modificações na Função `nudgeUser`

- Detecção automática de relacionamento com tarefas
- Verificação de tarefas em atraso
- Envio de notificações específicas baseadas no contexto

## Benefícios

1. **Comunicação Mais Eficiente**: Notificações específicas sobre tarefas
2. **Acompanhamento Automático**: Detecção de tarefas em atraso
3. **Interface Intuitiva**: Visualização clara das tarefas designadas
4. **Notificações Contextuais**: E-mails específicos baseados no tipo de interação

## Próximos Passos

1. Implementar notificações push em tempo real
2. Adicionar configurações de preferência de notificação
3. Criar dashboard de analytics de tarefas
4. Implementar lembretes automáticos periódicos
