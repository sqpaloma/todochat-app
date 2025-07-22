"use client";

import { QuickAction } from "./quick-action";
import { Feature } from "./feature";
import {
  CheckSquare,
  MessageSquare,
  Users,
  Zap,
  Mail,
  Calendar,
  Target,
  Sparkles,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const quickActions = [
    {
      icon: CheckSquare,
      title: "Tasks",
      description: "Organize tudo de forma divertida",
      href: "/tasks",
      stats: "3 pendentes",
      gradient: "from-blue-500 to-cyan-400",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: MessageSquare,
      title: "Chat",
      description: "Converse e colabore em tempo real",
      href: "/chat",
      stats: "2 online",
      gradient: "from-green-500 to-emerald-400",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      icon: Users,
      title: "Equipe",
      description: "Gerencie seu time dos sonhos",
      href: "/team",
      stats: "3 membros",
      gradient: "from-orange-500 to-red-400",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Mensagem → Tarefa",
      description: "Transforme conversas em ação instantaneamente",
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      icon: Mail,
      title: "Notificações Smart",
      description: "Receba updates automáticos por email",
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      icon: Calendar,
      title: "Calendário Mágico",
      description: "Visualize prazos de forma intuitiva",
      color: "text-pink-500",
      bg: "bg-pink-100",
    },
    {
      icon: Target,
      title: "Produtividade++",
      description: "Acompanhe resultados em tempo real",
      color: "text-indigo-500",
      bg: "bg-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 pt-8 sm:pt-12 lg:pt-0">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-purple-200">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Sobre o Chat do
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-pink-500" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
            Onde conversas viram
            <br className="hidden sm:block" />
            <span className="block sm:inline">
              <span className="gradient-text">resultados incríveis</span>
              <div className="inline-block ml-2 sm:ml-4 float-animation">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-400 fill-current" />
              </div>
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium px-4">
            O <strong className="gradient-text">Chat do</strong> é a ferramenta
            mais divertida para transformar suas conversas em tarefas
            organizadas. Sua equipe vai amar a produtividade gamificada! 🚀
          </p>

          <div className="flex justify-center px-4">
            <Button
              onClick={() => (window.location.href = "/tasks")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Começar a Diversão
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Explore as <span className="gradient-text">funcionalidades</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Acesse rapidamente tudo que você precisa para manter sua equipe
            produtiva e feliz
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Recursos que vão te{" "}
            <span className="gradient-text">surpreender</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Funcionalidades pensadas para tornar o trabalho em equipe mais
            eficiente e divertido
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4 pb-8 sm:pb-12">
          <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Pronto para começar a{" "}
              <span className="gradient-text">revolução</span>?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de equipes que já descobriram o prazer de
              trabalhar de forma organizada e divertida.
            </p>
            <Button
              onClick={() => (window.location.href = "/tasks")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Vamos começar! ✨
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
