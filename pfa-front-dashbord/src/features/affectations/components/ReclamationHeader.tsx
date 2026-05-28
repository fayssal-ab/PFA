
import { ArrowLeft, User, Clock } from "lucide-react";
import { Reclamation } from "../../../types";

type Props = {
	reclamation: Reclamation | null;
	navigate: any;
};

export default function ReclamationHeader({ reclamation, navigate }: Props) {
	return (
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
			<button
				onClick={() => navigate(-1)}
				className="mb-5 flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
			>
				<ArrowLeft size={16} />
				Retour
			</button>

			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-3 flex-wrap">
						<span className="text-xs font-mono text-gray-500 font-bold">
							#{reclamation?.id}
						</span>

						<span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
							{reclamation?.status?.status}
						</span>

						<span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/20">
							{reclamation?.priority?.priority}
						</span>
					</div>

					<h1 className="text-3xl font-bold text-white mb-3">
						{reclamation?.titre}
					</h1>

					<p className="text-sm text-gray-300 leading-relaxed">
						{reclamation?.description}
					</p>
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm text-gray-300">
						<div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
							<User size={15} className="text-indigo-300" />
						</div>

						<span>
							{reclamation?.client?.user?.nom}{" "}
							{reclamation?.client?.user?.prenom}
						</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-300">
						<div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
							<Clock size={15} className="text-orange-300" />
						</div>

						<span>
							{reclamation?.dateDepot
								? new Date(reclamation.dateDepot).toLocaleString("fr-FR")
								: ""}
						</span>
					</div>

					<div className="inline-flex px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold">
						{reclamation?.categorie?.categorie}
					</div>
				</div>
			</div>
		</div>
	);
}
