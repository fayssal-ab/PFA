export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface AuthUser {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export interface Client {
  id: number;
  telephone?: string;
  adresse?: string;
  user?: User;
}

export interface Reclamation {
  id: number;
  titre: string;
  description?: string;
  dateDepot?: string;
  dateModification?: string;
  status?: Status;
  priority?: Priority;
  categorie?: CategorieReclamation;
  client?: Client;
}

export interface Status {
  id: number;
  status: string;
}

export interface Priority {
  id: number;
  priority: string;
}

export interface CategorieReclamation {
  id: number;
  categorie: string;
}

export interface Notification {
  id: number;
  message: string;
  lue: boolean;
  dateEnvoi: string;
}

export interface ReponseReclamation {
  id: number;
  reponse: string;
  agent?: Agent;
  reclamation?: Reclamation;
}

export interface Agent {
  id: number;
  disponible: boolean;
  user?: User;
}

export interface ApiResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}