// Centralized gradient classes - NO MORE HARDCODED GRADIENTS!
export const gradientClasses = {
  // Primary gradient (Purple to Pink)
  primary: "bg-gradient-to-r from-purple-500 to-pink-500",
  primaryHover: "hover:from-purple-600 hover:to-pink-600",
  primaryBr: "bg-gradient-to-br from-purple-500 to-pink-500",
  
  // Button combinations
  primaryButton: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  
  // Background gradients for pages
  backgroundGradient: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
  
  // Icon gradients
  iconGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  
  // Avatar fallback
  avatarGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  
  // Secondary gradients
  secondary: "bg-gradient-to-r from-blue-500 to-cyan-500",
  success: "bg-gradient-to-r from-green-500 to-emerald-500",
  warning: "bg-gradient-to-r from-orange-500 to-red-500",
} as const;

// Helper function to get complete button classes
export const getPrimaryButtonClasses = (additional = "") => 
  `${gradientClasses.primaryButton} text-white ${additional}`;

// Helper function to get icon classes
export const getPrimaryIconClasses = (size = "w-8 h-8") => 
  `${size} ${gradientClasses.iconGradient} rounded-lg flex items-center justify-center`;

// Helper for avatar fallback
export const getAvatarFallbackClasses = () =>
  `${gradientClasses.avatarGradient} text-white font-bold`;

// Usage examples:
/*
// Instead of: className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
// Use: className={getPrimaryButtonClasses("px-4 py-2 rounded-lg")}

// Instead of: className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
// Use: className={getPrimaryIconClasses()}
*/