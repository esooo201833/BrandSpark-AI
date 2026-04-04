// Generation types
export interface GenerationPrompt {
  id: string;
  name: string;
  description: string;
  category: 'brand' | 'content' | 'social' | 'landing' | 'ads';
  template?: string;
  placeholders?: string[];
}

export interface GeneratedContent {
  id: string;
  promptId: string;
  input: Record<string, string>;
  output: string;
  tone?: 'professional' | 'casual' | 'creative' | 'technical';
  createdAt: Date;
  userId: string;
}

// User and workspace types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  credits?: number;
}

export interface BrandProfile {
  id: string;
  userId: string;
  name: string;
  tagline?: string;
  values?: string[];
  targetAudience?: string;
  voice?: string;
  createdAt: Date;
}

// Template types
export interface ContentTemplate {
  id: string;
  name: string;
  category: GenerationPrompt['category'];
  description: string;
  fields: TemplateField[];
  previewOutput?: string;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiline';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type GenerateResponse = ApiResponse<{
  content: string;
  contentId: string;
}>;
