"use client";

import { Header } from "@/components/header";
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
    <div className="min-h-screen bg-gray-50">
      <Header activeView="home" />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold mb-8 border border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Sobre o Chat do
              <Heart className="w-4 h-4 ml-2 text-pink-500" />
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Onde conversas viram
              <br />
              <span className="gradient-text">resultados incríveis</span>
              <div className="inline-block ml-4 float-animation">
                <Star className="w-12 h-12 text-yellow-400 fill-current" />
              </div>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              O <strong className="gradient-text">Chat do</strong> é a
              ferramenta mais divertida para transformar suas conversas em
              tarefas organizadas. Sua equipe vai amar a produtividade
              gamificada! 🚀
            </p>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => (window.location.href = "/tasks")}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Começar a Diversão
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Explore as <span className="gradient-text">funcionalidades</span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
              Acesse rapidamente tudo que você precisa para manter sua equipe
              produtiva e feliz
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Recursos que vão te{" "}
              <span className="gradient-text">surpreender</span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
              Funcionalidades pensadas para tornar o trabalho em equipe mais
              eficiente e divertido
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Feature key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-3xl p-12 shadow-xl">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Pronto para começar a{" "}
                <span className="gradient-text">revolução</span>?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de equipes que já descobriram o prazer de
                trabalhar de forma organizada e divertida.
              </p>
              <Button
                onClick={() => (window.location.href = "/tasks")}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Vamos começar! ✨
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
