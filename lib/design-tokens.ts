// Design Tokens - Sistema centralizado de cores e gradientes
export const gradients = {
  // Primary (Purple to Pink)
  primary: "bg-gradient-to-r from-purple-500 to-pink-500",
  primaryButton: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  primaryBr: "bg-gradient-to-br from-purple-500 to-pink-500",
  
  // Secondary colors
  secondary: "bg-gradient-to-r from-blue-500 to-cyan-500",
  success: "bg-gradient-to-r from-green-500 to-emerald-500",
  warning: "bg-gradient-to-r from-orange-500 to-red-500",
  
  // Page backgrounds
  pageBackground: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
} as const;

// Simple color palette
export const colors = {
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff", 
    500: "#7c3aed",
    600: "#7c3aed",
    900: "#581c87",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    600: "#4b5563",
    900: "#111827",
  }
} as const;

// Helper utilities (keep only the most used ones)
export const buttonClasses = {
  primary: `${gradients.primaryButton} text-white`,
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
} as const;

export const iconClasses = {
  small: `w-4 h-4`,
  medium: `w-8 h-8 ${gradients.primaryBr} rounded-lg flex items-center justify-center`,
  large: `w-10 h-10 ${gradients.primaryBr} rounded-xl flex items-center justify-center`,
} as const;