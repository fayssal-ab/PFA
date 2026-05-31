import { CheckCircle, ChevronDown } from "lucide-react";
import { Status } from "../../../types";

type Props = {
	statuses: Status[];
	selectedStatus: string;
	setSelectedStatus: (value: string) => void;
	reponse: string;
	setReponse: (value: string) => void;
	traiterReclamation: () => void;
};

export default function TraitementReclamationSection({
	statuses,
	selectedStatus,
	setSelectedStatus,
	reponse,
	setReponse,
	traiterReclamation,
}: Props) {
	return (
		<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
			<div className="px-5 py-4 border-b border-white/5 flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
					<CheckCircle size={15} className="text-violet-400" />
				</div>
				<h2 className="text-sm font-bold text-white">
					Traitement de la réclamation
				</h2>
			</div>

			<div className="p-5 space-y-5">
				<div>
					<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
						Nouveau statut
					</label>
					<div className="relative">
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="w-full appearance-none bg-white/[0.04] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 transition-all cursor-pointer pr-10"
						>
							<option value="" className="bg-[#1a1a2e] text-gray-400">
								Choisir un statut...
							</option>
							{statuses.map((s) => (
								<option
									key={s.id}
									value={s.id}
									className="bg-[#1a1a2e] text-white"
								>
									{s.status}
								</option>
							))}
						</select>
						<ChevronDown
							size={15}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
						/>
					</div>
				</div>

				<div>
					<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
						Réponse à envoyer
					</label>
					<textarea
						value={reponse}
						onChange={(e) => setReponse(e.target.value)}
						rows={5}
						placeholder="Rédigez votre réponse au client..."
						className="w-full bg-white/[0.04] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 placeholder-gray-600 transition-all"
					/>
				</div>

				
				<div className="flex justify-end">
					<button
						onClick={traiterReclamation}
						disabled={!selectedStatus}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all shadow-lg shadow-violet-900/30"
					>
						<CheckCircle size={15} />
						Enregistrer le traitement
					</button>
				</div>
			</div>
		</div>
	);
}
