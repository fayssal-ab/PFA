import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layouts/DashboardLayout";

import api from "../../../lib/axiosInstance";

import {
	Reclamation,
	Commentaire,
	PieceJointe,
	ApiResponse,
	Status,
} from "../../../types";

import { useAuth } from "../../../features/auth/hooks/useAuth";

import ReclamationHeader from "../components/ReclamationHeader";
import ClientFilesSection from "../components/ClientFilesSection";
import AgentFilesSection from "../components/AgentFilesSection";
import TraitementReclamationSection from "../components/TraitementReclamationSection";
import CommentairesSection from "../components/CommentairesSection";

export default function AffectationDetailPage() {
	const { id } = useParams();

	const navigate = useNavigate();

	const { user } = useAuth();

	const [reclamation, setReclamation] = useState<Reclamation | null>(null);

	const [commentaires, setCommentaires] = useState<Commentaire[]>([]);

	const [clientFiles, setClientFiles] = useState<PieceJointe[]>([]);

	const [agentFiles, setAgentFiles] = useState<PieceJointe[]>([]);

	const [message, setMessage] = useState("");

	const [loading, setLoading] = useState(true);

	const [sending, setSending] = useState(false);

	const [uploading, setUploading] = useState(false);

	const [statuses, setStatuses] = useState<Status[]>([]);

	const [selectedStatus, setSelectedStatus] = useState("");

	const [reponse, setReponse] = useState("");

	const [clientPage, setClientPage] = useState(0);

	const [clientTotalPages, setClientTotalPages] = useState(0);

	const [agentPage, setAgentPage] = useState(0);

	const [agentTotalPages, setAgentTotalPages] = useState(0);

	useEffect(() => {
		if (id) {
			loadAll();
		}
	}, [id]);

	const loadAll = async () => {
		setLoading(true);

		try {
			await Promise.all([
				loadReclamation(),
				loadCommentaires(),
				loadClientFiles(),
				loadAgentFiles(),
				loadStatuses(),
			]);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const loadStatuses = async () => {
		try {
			const res = await api.get<Status[]>("/status/get-status");

			setStatuses(res.data || []);
		} catch (e) {
			console.error(e);
		}
	};

	const loadReclamation = async () => {
		try {
			const res = await api.get<Reclamation>(
				`/reclamations/get-reclamation/${id}`,
			);

			setReclamation(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	const loadCommentaires = async () => {
		try {
			const res = await api.get<Commentaire[]>(
				`/commentaires/get-commentaires/${id}`,
			);

			setCommentaires(Array.isArray(res.data) ? res.data : []);
		} catch (e) {
			console.error(e);
		}
	};

	const loadClientFiles = async (page: number = 0) => {
		try {
			const res = await api.get<ApiResponse<PieceJointe>>(
				`/piece-jointes/reclamation/${id}`,
				{
					params: {
						role: "client",
						page,
						size: 3,
					},
				},
			);

			setClientFiles(res.data.content || []);
			setClientPage(res.data.page.number);
			setClientTotalPages(res.data.page.totalPages);
		} catch (e) {
			console.error(e);
		}
	};

	const loadAgentFiles = async (page: number = 0) => {
		try {
			const res = await api.get<ApiResponse<PieceJointe>>(
				`/piece-jointes/reclamation/${id}`,
				{
					params: {
						role: "agent",
						page,
						size: 3,
					},
				},
			);

			setAgentFiles(res.data.content || []);
			setAgentPage(res.data.page.number);
			setAgentTotalPages(res.data.page.totalPages);
		} catch (e) {
			console.error(e);
		}
	};

	const sendComment = async () => {
		if (!message.trim()) return;

		setSending(true);

		try {
			await api.post("/commentaires/add-commentaire", {
				contenu: message,

				reclamation: {
					id,
				},

				user: {
					id: user?.userId,
				},
			});

			setMessage("");

			await loadCommentaires();
		} catch (e) {
			console.error(e);
		} finally {
			setSending(false);
		}
	};

	const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const formData = new FormData();

		formData.append("file", file);

		setUploading(true);

		try {
			await api.post(`/piece-jointes/upload/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			await loadAgentFiles();
		} catch (e) {
			console.error(e);
		} finally {
			setUploading(false);
		}
	};
	const deleteFile = async (id: number) => {
		try {
			await api.delete(`/piece-jointes/delete-piece-jointe/${id}`);

			await loadAgentFiles(agentPage);
		} catch (e) {
			console.error(e);
		}
	};
	const downloadFile = async (filename?: string) => {
		if (!filename) return;

		try {
			const response = await api.get(`/piece-jointes/download/${filename}`, {
				responseType: "blob",
			});

			const url = window.URL.createObjectURL(new Blob([response.data]));

			const link = document.createElement("a");

			link.href = url;

			link.setAttribute("download", filename);

			document.body.appendChild(link);

			link.click();

			link.remove();
		} catch (e) {
			console.error(e);
		}
	};

	const traiterReclamation = async () => {
		if (!selectedStatus) return;

		try {
			await api.put(`/reclamations/reclamation/${id}/status/${selectedStatus}`);

			if (reponse.trim()) {
				await api.post("/reponse-reclamations/create-reponse", {
					reponse: reponse,

					agent: {
						id: user?.agentId,
					},

					reclamation: {
						id: id,
					},
				});
			}

			setReponse("");

			setSelectedStatus("");

			await loadAll();
		} catch (e) {
			console.error(e);
		}
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-[60vh]">
					<div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<ReclamationHeader reclamation={reclamation} navigate={navigate} />

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					<ClientFilesSection
						clientFiles={clientFiles}
						downloadFile={downloadFile}
						page={clientPage}
						totalPages={clientTotalPages}
						onPageChange={loadClientFiles}
					/>

					<AgentFilesSection
						agentFiles={agentFiles}
						downloadFile={downloadFile}
						uploadFile={uploadFile}
						uploading={uploading}
						page={agentPage}
						totalPages={agentTotalPages}
						onPageChange={loadAgentFiles}
						deleteFile={deleteFile}
					/>
				</div>

				<TraitementReclamationSection
					statuses={statuses}
					selectedStatus={selectedStatus}
					setSelectedStatus={setSelectedStatus}
					reponse={reponse}
					setReponse={setReponse}
					traiterReclamation={traiterReclamation}
				/>

				<CommentairesSection
					commentaires={commentaires}
					message={message}
					setMessage={setMessage}
					sendComment={sendComment}
					sending={sending}
					user={user}
				/>
			</div>
		</DashboardLayout>
	);
}
