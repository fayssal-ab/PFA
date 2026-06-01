import { LucideIcon } from "lucide-react";

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
	userId?: number;
	clientId?: number;
	agentId?: number;
	managerId?: number;
	exp?: number;
	iat?: number;
}

export interface Agent {
	id: number;
	disponible: boolean;
	user?: User;
}

export interface Manager {
	id: number;
	departement?: string;
	user?: User;
}

export interface Reclamation {
	id: number;
	titre: string;
	description?: string;
	dateDepot?: string;
	status?: Status;
	priority?: Priority;
	categorie?: Categorie;
	client?: Client;
	affectations: Affectation;
}

export interface Client {
	id: number;
	user?: User;
}

export interface Status {
	id: number;
	status: string;
}

export interface Priority {
	id: number;
	priority: string;
}

export interface Categorie {
	id: number;
	categorie: string;
}

export interface Notification {
	id: number;
	message: string;
	lue: boolean;
	dateEnvoi: string;
}

export interface Affectation {
	id: number;
	commentaire?: string;
	dateAffectation: string;
	reclamation?: Reclamation;
	agent?: Agent;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface ApiResponse<T> {
	content: T[];
	page: {
		size: number;
		number: number;
		totalElements: number;
		totalPages: number;
	};
}

export interface StatistiquesReclamations {
	total?: number;
	totalReclamations?: number;
	enCours?: number;
	en_cours?: number;
	resolues?: number;
	resolu?: number;
}

export interface StatistiquesUsers {
	total?: number;
	totalUsers?: number;
}

export interface TabItem {
	key: string;
	label: string;
}

export interface DashboardLayoutProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	actions?: React.ReactNode;
	tabs?: TabItem[];
	activeTab?: string;
	onTabChange?: (tabKey: string) => void;
	secondaryPanel?: React.ReactNode;
}

export interface NavItem {
	to: string;
	icon: LucideIcon;
	roles: string[];
	label: string;
}
export interface Categorie {
	id: number;
	categorie: string;
	icon?: string;
	count?: number;
}

export interface SidebarCategorieProps {
	categories: Categorie[];
	selectedCategorie: string | null;
	onSelectCategorie: (categorie: string | null) => void;
	loading: boolean;
}

export interface Commentaire {
	id: number;
	contenu: string;
	dateCommentaire?: string;
	user?: User;
	reclamation?: Reclamation;
}

export interface PieceJointe {
	id: number;

	fichier?: string;

	reclamation?: Reclamation;

	user?: User;
}
export interface Historique {
	id: number;
	ancienStatus?: string;
	nouveauStatus?: string;
	reclamation?: Reclamation;
	user: User;
	action: string;
	dateAction: Date;
}
