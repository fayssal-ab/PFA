import { ArrowLeft, User, Clock, Tag, Hash } from "lucide-react";
import { Reclamation } from "../../../types";

type Props = {
	reclamation: Reclamation | null;
	navigate: any;
};

const statusStyle = (s?: string) => {
	const n = s?.toLowerCase() || "";
	if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé"))
		return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25";
	if (n.includes("cours") || n.includes("traitement"))
		return "bg-amber-500/15 text-amber-300 border-amber-500/25";
	if (n.includes("ouvert") || n.includes("nouveau"))
		return "bg-blue-500/15 text-blue-300 border-blue-500/25";
	return "bg-gray-500/15 text-gray-300 border-gray-500/25";
};

const priorityStyle = (p?: string) => {
	const n = p?.toLowerCase() || "";
	if (n.includes("haute") || n.includes("high") || n.includes("urgent"))
		return "bg-red-500/15 text-red-300 border-red-500/25";
	if (n.includes("moyenne") || n.includes("medium"))
		return "bg-amber-500/15 text-amber-300 border-amber-500/25";
	return "bg-gray-500/15 text-gray-300 border-gray-500/25";
};

export default function ReclamationHeader({ reclamation, navigate }: Props) {
	return (
		<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
			<div className="h-[3px] bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

			<div className="p-6">
				<button
					onClick={() => navigate(-1)}
					className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors group"
				>
					<ArrowLeft
						size={15}
						className="group-hover:-translate-x-0.5 transition-transform"
					/>
					Retour aux affectations
				</button>

				<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap mb-3">
							<span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-gray-600">
								<Hash size={10} />
								{reclamation?.id}
							</span>
							<span
								className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${statusStyle(reclamation?.status?.status)}`}
							>
								{reclamation?.status?.status || "—"}
							</span>
							<span
								className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${priorityStyle(reclamation?.priority?.priority)}`}
							>
								{reclamation?.priority?.priority || "—"}
							</span>
							{reclamation?.categorie?.categorie && (
								<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-white/5 text-gray-400 border border-white/10">
									<Tag size={9} />
									{reclamation.categorie.categorie}
								</span>
							)}
						</div>

						<h1 className="text-2xl font-bold text-white mb-3 leading-snug">
							{reclamation?.titre || "Sans titre"}
						</h1>

						<p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
							{reclamation?.description || "Pas de description"}
						</p>
					</div>

					<div className="flex flex-col gap-2 shrink-0">
						<div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
							<div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
								<User size={13} className="text-violet-400" />
							</div>
							<div>
								<p className="text-[10px] text-gray-600 uppercase tracking-wider">
									Client
								</p>
								<p className="text-sm text-white font-medium">
									{reclamation?.client?.user?.nom}{" "}
									{reclamation?.client?.user?.prenom}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
							<div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
								<Clock size={13} className="text-orange-400" />
							</div>
							<div>
								<p className="text-[10px] text-gray-600 uppercase tracking-wider">
									Date dépôt
								</p>
								<p className="text-sm text-white font-medium">
									{reclamation?.dateDepot
										? new Date(reclamation.dateDepot).toLocaleDateString(
												"fr-FR",
												{
													day: "numeric",
													month: "short",
													year: "numeric",
												},
											)
										: "—"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
