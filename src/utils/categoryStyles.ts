import { CategoryType } from '@/data/knowledgeData';

export interface CategoryStyleClasses {
  border: string;
  bg: string;
  icon: string;
}

const CATEGORY_CLASSES: Record<CategoryType, CategoryStyleClasses> = {
  frontend: { 
    border: 'border-frontend/40 hover:border-frontend/70', 
    bg: 'bg-frontend/20 group-hover:bg-frontend/30', 
    icon: 'text-frontend' 
  },
  backend: { 
    border: 'border-backend/40 hover:border-backend/70', 
    bg: 'bg-backend/20 group-hover:bg-backend/30', 
    icon: 'text-backend' 
  },
  database: { 
    border: 'border-database/40 hover:border-database/70', 
    bg: 'bg-database/20 group-hover:bg-database/30', 
    icon: 'text-database' 
  },
  devops: { 
    border: 'border-devops/40 hover:border-devops/70', 
    bg: 'bg-devops/20 group-hover:bg-devops/30', 
    icon: 'text-devops' 
  },
  security: { 
    border: 'border-security/40 hover:border-security/70', 
    bg: 'bg-security/20 group-hover:bg-security/30', 
    icon: 'text-security' 
  },
  testing: { 
    border: 'border-testing/40 hover:border-testing/70', 
    bg: 'bg-testing/20 group-hover:bg-testing/30', 
    icon: 'text-testing' 
  },
  workflow: { 
    border: 'border-workflow/40 hover:border-workflow/70', 
    bg: 'bg-workflow/20 group-hover:bg-workflow/30', 
    icon: 'text-workflow' 
  },
  central: { 
    border: 'border-central/40 hover:border-central/70', 
    bg: 'bg-central/20 group-hover:bg-central/30', 
    icon: 'text-central' 
  },
};

export const getCategoryClasses = (category: CategoryType): CategoryStyleClasses => {
  return CATEGORY_CLASSES[category] || CATEGORY_CLASSES.frontend;
};

export const getCategoryGradient = (category: CategoryType): string => {
  return `linear-gradient(to bottom right, hsl(var(--${category}) / 0.1), transparent)`;
};

export const getCategoryBoxShadow = (category: CategoryType): string[] => {
  return [
    `0 0 0px hsl(var(--${category}) / 0)`,
    `0 0 20px hsl(var(--${category}) / 0.6)`,
    `0 0 0px hsl(var(--${category}) / 0)`,
  ];
};
