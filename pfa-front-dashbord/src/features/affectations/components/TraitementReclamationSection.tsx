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
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			<div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-md bg-teal-50 flex items-center justify-center">
					<CheckCircle size={15} className="text-teal-600" />
				</div>
				<h2 className="text-sm font-bold text-slate-900">
					Traitement de la réclamation
				</h2>
			</div>

			<div className="p-4 space-y-4">
				<div>
					<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
						Nouveau statut
					</label>
					<div className="relative">
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="w-full appearance-none bg-white border border-slate-200 text-slate-900 rounded-md px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer pr-10"
						>
							<option value="">
								Choisir un statut...
							</option>
							{statuses.map((s) => (
								<option
									key={s.id}
									value={s.id}
								>
									{s.status}
								</option>
							))}
						</select>
						<ChevronDown
							size={15}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
						/>
					</div>
				</div>

				<div>
					<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
						Réponse à envoyer
					</label>
					<textarea
						value={reponse}
						onChange={(e) => setReponse(e.target.value)}
						rows={5}
						placeholder="Rédigez votre réponse au client..."
						className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-4 py-3 text-sm outline-none resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder-slate-400 transition-all"
					/>
				</div>


				<div className="flex justify-end">
					<button
						onClick={traiterReclamation}
						disabled={!selectedStatus}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
					>
						<CheckCircle size={15} />
						Enregistrer le traitement
					</button>
				</div>
			</div>
		</div>
	);
}
