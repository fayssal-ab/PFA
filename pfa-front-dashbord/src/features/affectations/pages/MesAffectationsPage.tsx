import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import {
	ClipboardList,
	Clock,
	MessageSquare,
	User,
	Eye,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Affectation, ApiResponse } from "../../../types";
import { useNavigate } from "react-router-dom";

export default function MesAffectationsPage() {
	const [affectations, setAffectations] = useState<Affectation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(0);
	const navigate = useNavigate();

	useEffect(() => {
		load();
	}, [page]);

	const load = async () => {
		setLoading(true);
		try {
			const r = await api.get<ApiResponse<Affectation>>(
				"/affectations/mes-affectations",
				{ params: { page, size: 4 } },
			);
			setAffectations(r.data?.content || []);
			setTotalPages(r.data?.page.totalPages || 0);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const statusColor = (s?: string): string => {
		const n = s?.toLowerCase() || "";
		if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé"))
			return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25";
		if (n.includes("cours") || n.includes("traitement"))
			return "bg-amber-500/15 text-amber-300 border border-amber-500/25";
		if (n.includes("ouvert") || n.includes("nouveau"))
			return "bg-blue-500/15 text-blue-300 border border-blue-500/25";
		return "bg-gray-500/15 text-gray-300 border border-gray-500/25";
	};

	const priorityColor = (p?: string): string => {
		const n = p?.toLowerCase() || "";
		if (n.includes("haute") || n.includes("high") || n.includes("urgent"))
			return "bg-red-500/15 text-red-300 border border-red-500/25";
		if (n.includes("moyenne") || n.includes("medium"))
			return "bg-amber-500/15 text-amber-300 border border-amber-500/25";
		return "bg-gray-500/15 text-gray-300 border border-gray-500/25";
	};

	if (loading && affectations.length === 0)
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-[60vh]">
					<div className="w-10 h-10 border-[3px] border-white/10 border-t-violet-500 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);

	return (
		<DashboardLayout>
			<div className="mb-8">
				<p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
					Espace agent
				</p>
				<h1 className="text-4xl font-bold text-white mt-2">Mes Affectations</h1>
				<p className="text-gray-500 text-sm mt-2">
					Les réclamations qui vous ont été assignées
				</p>
			</div>

			{affectations.length === 0 ? (
				<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 flex flex-col items-center justify-center py-24">
					<div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5">
						<ClipboardList size={32} className="text-violet-400" />
					</div>
					<p className="text-lg font-bold text-white">Aucune affectation</p>
					<p className="text-sm text-gray-500 mt-2">
						Vous n'avez pas encore de réclamations assignées
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{affectations.map((a) => (
						<div
							key={a.id}
							className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-5 hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-200 group"
						>
							<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap mb-3">
										<span className="text-[11px] font-mono font-bold text-gray-600">
											#{a.reclamation?.id}
										</span>
										<span
											className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${statusColor(
												a.reclamation?.status?.status,
											)}`}
										>
											{a.reclamation?.status?.status || "—"}
										</span>
										<span
											className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${priorityColor(
												a.reclamation?.priority?.priority,
											)}`}
										>
											{a.reclamation?.priority?.priority || "—"}
										</span>
										{a.reclamation?.categorie?.categorie && (
											<span className="inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-white/5 text-gray-400 border border-white/10">
												{a.reclamation.categorie.categorie}
											</span>
										)}
									</div>

									<h3 className="text-[17px] font-bold text-white mb-2 truncate">
										{a.reclamation?.titre || "Sans titre"}
									</h3>

									<p className="text-sm text-gray-500 leading-relaxed line-clamp-1">
										{a.reclamation?.description || "Pas de description"}
									</p>

									<div className="flex items-center gap-4 mt-3 flex-wrap">
										<div className="flex items-center gap-1.5 text-xs text-gray-600">
											<Clock size={12} className="text-orange-400" />
											<span>
												{a.dateAffectation
													? new Date(a.dateAffectation).toLocaleDateString(
															"fr-FR",
															{
																day: "numeric",
																month: "short",
																year: "numeric",
															},
														)
													: "—"}
											</span>
										</div>
										{a.reclamation?.client?.user && (
											<div className="flex items-center gap-1.5 text-xs text-gray-600">
												<User size={12} className="text-cyan-400" />
												<span>
													{a.reclamation.client.user.nom}{" "}
													{a.reclamation.client.user.prenom}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										onClick={() =>
											navigate(`/agent/affectations/${a.reclamation?.id}`)
										}
										className="h-10 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-violet-900/40"
									>
										<Eye size={15} />
										Détails
									</button>
									<button
										onClick={() =>
											navigate(`/agent/reponses/${a.reclamation?.id}`)
										}
										className="h-10 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/25 hover:scale-[1.02] transition-all flex items-center gap-2"
									>
										<MessageSquare size={15} />
										Réponses
									</button>
								</div>
							</div>
						</div>
					))}

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-3 pt-4">
							<button
								onClick={() => setPage(Math.max(0, page - 1))}
								disabled={page === 0}
								className="w-10 h-10 rounded-xl border border-white/10 bg-[#1a1a2e] text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
							>
								<ChevronLeft size={16} />
							</button>

							<div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 font-medium min-w-[80px] text-center">
								{page + 1} / {totalPages}
							</div>

							<button
								onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
								disabled={page >= totalPages - 1}
								className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-violet-900/40"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					)}
				</div>
			)}
		</DashboardLayout>
	);
}
