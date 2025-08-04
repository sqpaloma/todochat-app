"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface InteractiveCodeProps {
  className?: string;
}

export function InteractiveCode({ className }: InteractiveCodeProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const codeExamples = {
    chat: {
      code: `// Chat em tempo real
const messages = useQuery(api.messages.list, {
  channelId: "general"
});

const sendMessage = useMutation(api.messages.send);
await sendMessage({
  content: "Olá equipe! 👋",
  channelId: "general"
});`,
      description: "Conecte-se com sua equipe em tempo real",
      result: "✅ Mensagem enviada com sucesso!",
    },
    tasks: {
      code: `// Transformar mensagem em tarefa
const createTask = useMutation(api.tasks.create);
await createTask({
  title: "Revisar design do app",
  description: "Analisar feedback dos usuários",
  assigneeId: "user_123",
  dueDate: "2024-02-15"
});`,
      description: "Transforme conversas em ações organizadas",
      result: "✅ Tarefa criada: Revisar design do app",
    },
    email: {
      code: `// Notificações automáticas
const sendNotification = useMutation(api.notifications.send);
await sendNotification({
  type: "task_assigned",
  userId: "user_123",
  email: "user@example.com",
  subject: "Nova tarefa atribuída"
});`,
      description: "Mantenha todos informados automaticamente",
      result: "✅ Email enviado para user@example.com",
    },
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setResult(null);

    // Simulate code execution
    setTimeout(() => {
      setResult(codeExamples[activeTab as keyof typeof codeExamples].result);
      setIsRunning(false);
    }, 1500);
  };

  const currentExample = codeExamples[activeTab as keyof typeof codeExamples];

  return (
    <div className={`bg-gray-900 rounded-2xl p-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "chat"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "tasks"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "email"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="mb-4">
        <pre className="text-green-400 text-sm leading-relaxed overflow-x-auto">
          <code>{currentExample.code}</code>
        </pre>
      </div>

      {/* Description */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <p className="text-gray-300 text-sm">{currentExample.description}</p>
      </div>

      {/* Run Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Executando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Executar código</span>
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{result}</span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xs font-bold">TS</span>
          </div>
          <p className="text-xs text-gray-400">TypeScript</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xs font-bold">RT</span>
          </div>
          <p className="text-xs text-gray-400">Real-time</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <p className="text-xs text-gray-400">AI Ready</p>
        </div>
      </div>
    </div>
  );
}
