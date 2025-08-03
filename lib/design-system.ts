// Design System - Cores e Gradientes Centralizados
export const gradients = {
  primary: "from-purple-500 to-pink-500",
  primaryHover: "from-purple-600 to-pink-600",
  secondary: "from-blue-500 to-cyan-500",
  success: "from-green-500 to-emerald-500",
  warning: "from-orange-500 to-red-500",
  danger: "from-red-500 to-pink-500",
} as const;

export const colors = {
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff", 
    500: "#7c3aed",
    600: "#7c3aed",
    900: "#581c87",
  },
  secondary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    500: "#0ea5e9", 
    600: "#0284c7",
    900: "#0c4a6e",
  }
} as const;

// Componentes reutilizáveis para elementos comuns
export const getGradientClasses = (variant: keyof typeof gradients) => ({
  background: `bg-gradient-to-r ${gradients[variant]}`,
  backgroundBr: `bg-gradient-to-br ${gradients[variant]}`,
  text: 'text-white',
  hover: variant === 'primary' ? `hover:${gradients.primaryHover}` : '',
});

export const getIconBackground = (variant: keyof typeof gradients = 'primary') => 
  `w-10 h-10 bg-gradient-to-br ${gradients[variant]} rounded-xl flex items-center justify-center`;

export const getSmallIconBackground = (variant: keyof typeof gradients = 'primary') => 
  `w-8 h-8 bg-gradient-to-br ${gradients[variant]} rounded-lg flex items-center justify-center`;

export const getPrimaryButton = () => 
  `bg-gradient-to-r ${gradients.primary} hover:${gradients.primaryHover} text-white`;

export const getCard = () => 
  "bg-white rounded-xl shadow-sm border border-gray-100 p-6";

export const getBadge = (variant: 'primary' | 'secondary' | 'success' | 'warning' = 'primary') => {
  const variants = {
    primary: "bg-purple-100 text-purple-800",
    secondary: "bg-blue-100 text-blue-800", 
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
  };
  return `px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`;
};