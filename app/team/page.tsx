"use client";

import { SidebarLayout } from "@/components/sidebar-layout";

function TeamPageContent() {
  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Equipe
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gerencie os membros da sua equipe
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Página da Equipe
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Esta página está em construção. Em breve você poderá gerenciar
              todos os membros da sua equipe aqui.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold">
              🚧 Em desenvolvimento
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <SidebarLayout activeView="team">
      <TeamPageContent />
    </SidebarLayout>
  );
}
