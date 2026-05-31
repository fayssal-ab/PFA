import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";

import { Reclamation, PieceJointe, ApiResponse } from "../../../types";

import ReclamationHeader from "../../affectations/components/ReclamationHeader";
import ClientFilesSection from "../../affectations/components/ClientFilesSection";
import AgentFilesSection from "../../affectations/components/AgentFilesSection";

import { MessageSquare, User, Calendar, CheckCircle } from "lucide-react";

export default function ReclamationDetailPage() {
	const { id } = useParams();

	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [reclamation, setReclamation] = useState<Reclamation | null>(null);

	const [clientFiles, setClientFiles] = useState<PieceJointe[]>([]);

	const [agentFiles, setAgentFiles] = useState<PieceJointe[]>([]);

	const [reponses, setReponses] = useState<any[]>([]);

	const [reponsePage, setReponsePage] = useState(0);

	const [reponseTotalPages, setReponseTotalPages] = useState(0);

	const [clientPage, setClientPage] = useState(0);

	const [clientTotalPages, setClientTotalPages] = useState(0);

	const [agentPage, setAgentPage] = useState(0);

	const [agentTotalPages, setAgentTotalPages] = useState(0);

	useEffect(() => {
		loadAll();
	}, [id]);
	useEffect(() => {
		if (id) {
			loadReponses(reponsePage);
		}
	}, [reponsePage]);
	const loadAll = async () => {
		setLoading(true);

		try {
			await Promise.all([
				loadReclamation(),
				loadClientFiles(),
				loadAgentFiles(),
				loadReponses(),
			]);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const loadReclamation = async () => {
		const res = await api.get(`/reclamations/get-reclamation/${id}`);

		setReclamation(res.data);
	};

	const loadClientFiles = async (page = 0) => {
		const res = await api.get<ApiResponse<PieceJointe>>(
			`/piece-jointes/reclamation/${id}`,
			{
				params: {
					role: "client",
					page,
					size: 5,
				},
			},
		);

		setClientFiles(res.data.content || []);

		setClientPage(res.data.page.number);

		setClientTotalPages(res.data.page.totalPages);
	};

	const loadAgentFiles = async (page = 0) => {
		const res = await api.get<ApiResponse<PieceJointe>>(
			`/piece-jointes/reclamation/${id}`,
			{
				params: {
					role: "agent",
					page,
					size: 5,
				},
			},
		);

		setAgentFiles(res.data.content || []);

		setAgentPage(res.data.page.number);

		setAgentTotalPages(res.data.page.totalPages);
	};

	const loadReponses = async (page: number = 0) => {
		const res = await api.get(`/reponse-reclamations/get-reponse/${id}`, {
			params: {
				page,
				size: 3,
			},
		});

		setReponses(res.data.content || []);

		setReponsePage(res.data.page.number);

		setReponseTotalPages(res.data.page.totalPages);
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
						uploadFile={() => {}}
						uploading={false}
						page={agentPage}
						totalPages={agentTotalPages}
						onPageChange={loadAgentFiles}
						deleteFile={() => {}}
					/>
				</div>

				<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
							<MessageSquare size={22} className="text-indigo-400" />
						</div>

						<div>
							<h2 className="text-xl font-bold text-white">
								Réponses de l'agent
							</h2>

							<p className="text-sm text-gray-400">
								Historique des réponses de traitement
							</p>
						</div>
					</div>

					{reponses.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-14">
							<MessageSquare size={45} className="text-gray-600 mb-3" />

							<p className="text-gray-400">Aucune réponse disponible</p>
						</div>
					) : (
						<div className="space-y-4">
							{reponses.map((rep: any) => (
								<div
									key={rep.id}
									className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all"
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
												<User size={16} className="text-indigo-300" />
											</div>

											<div>
												<p className="text-white font-semibold">
													{rep.agent?.user?.nom} {rep.agent?.user?.prenom}
												</p>

												<p className="text-xs text-gray-500">
													Agent responsable
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2 text-xs text-gray-500">
											<Calendar size={14} />

											{rep.dateCreation
												? new Date(rep.dateCreation).toLocaleDateString(
														"fr-FR",
														{
															day: "numeric",
															month: "short",
															year: "numeric",
														},
													)
												: ""}
										</div>
									</div>

									<div className="bg-[#0f172a]/50 rounded-xl p-4 border border-white/5">
										<p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
											{rep.reponse}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
					{reponseTotalPages > 1 && (
						<div className="flex items-center justify-center gap-4 mt-6">
							<button
								disabled={reponsePage === 0}
								onClick={() => setReponsePage(Math.max(0, reponsePage - 1))}
								className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
							>
								Précédent
							</button>

							<span className="text-white font-medium">
								{reponsePage + 1} / {Math.max(reponseTotalPages, 1)}
							</span>

							<button
								disabled={reponsePage >= reponseTotalPages - 1}
								onClick={() => setReponsePage(reponsePage + 1)}
								className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
							>
								Suivant
							</button>
						</div>
					)}
				</div>

				<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
							<CheckCircle size={22} className="text-emerald-400" />
						</div>

						<div>
							<h2 className="text-xl font-bold text-white">Statut Final</h2>

							<p className="text-sm text-gray-400">
								État actuel de la réclamation
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm mb-2">Statut actuel</p>

							<span className="inline-flex px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
								{reclamation?.status?.status || "Non défini"}
							</span>
						</div>

						<div className="text-right">
							<p className="text-gray-500 text-xs">Réclamation</p>

							<p className="text-white font-semibold">#{reclamation?.id}</p>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
