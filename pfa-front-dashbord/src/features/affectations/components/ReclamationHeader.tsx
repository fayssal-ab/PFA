import { ArrowLeft, User, Clock, Tag, Hash } from "lucide-react";
import { Reclamation } from "../../../types";

type Props = {
	reclamation: Reclamation | null;
	navigate: any;
};

const statusStyle = (s?: string) => {
	const n = s?.toLowerCase() || "";
	if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé"))
		return "bg-emerald-50 text-emerald-700 border-emerald-200";
	if (n.includes("cours") || n.includes("traitement"))
		return "bg-amber-50 text-amber-700 border-amber-200";
	if (n.includes("ouvert") || n.includes("nouveau"))
		return "bg-blue-50 text-blue-700 border-blue-200";
	return "bg-slate-100 text-slate-700 border-slate-200";
};

const priorityStyle = (p?: string) => {
	const n = p?.toLowerCase() || "";
	if (n.includes("haute") || n.includes("high") || n.includes("urgent"))
		return "bg-red-50 text-red-700 border-red-200";
	if (n.includes("moyenne") || n.includes("medium"))
		return "bg-amber-50 text-amber-700 border-amber-200";
	return "bg-slate-100 text-slate-700 border-slate-200";
};

export default function ReclamationHeader({ reclamation, navigate }: Props) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			<div className="h-[3px] bg-teal-600" />

			<div className="p-4">
				<button
					onClick={() => navigate(-1)}
					className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors group"
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
							<span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500">
								<Hash size={10} />
								{reclamation?.id}
							</span>
							<span
								className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${statusStyle(reclamation?.status?.status)}`}
							>
								{reclamation?.status?.status || "—"}
							</span>
							<span
								className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${priorityStyle(reclamation?.priority?.priority)}`}
							>
								{reclamation?.priority?.priority || "—"}
							</span>
							{reclamation?.categorie?.categorie && (
								<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
									<Tag size={9} />
									{reclamation.categorie.categorie}
								</span>
							)}
						</div>

						<h1 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
							{reclamation?.titre || "Sans titre"}
						</h1>

						<p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
							{reclamation?.description || "Pas de description"}
						</p>
					</div>

					<div className="flex flex-col gap-2 shrink-0">
						<div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
							<div className="w-7 h-7 rounded-md bg-teal-50 flex items-center justify-center">
								<User size={13} className="text-teal-600" />
							</div>
							<div>
								<p className="text-[10px] text-slate-500 uppercase tracking-wider">
									Client
								</p>
								<p className="text-sm text-slate-900 font-medium">
									{reclamation?.client?.user?.nom}{" "}
									{reclamation?.client?.user?.prenom}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
							<div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center">
								<Clock size={13} className="text-amber-600" />
							</div>
							<div>
								<p className="text-[10px] text-slate-500 uppercase tracking-wider">
									Date dépôt
								</p>
								<p className="text-sm text-slate-900 font-medium">
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
