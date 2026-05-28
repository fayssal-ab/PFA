
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
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
			<h2 className="text-xl font-bold text-white mb-5">
				Traitement de la réclamation
			</h2>

			<div className="mb-5">
				<label className="block text-sm font-medium text-gray-300 mb-2">
					Statut
				</label>

				<select
					value={selectedStatus}
					onChange={(e) => setSelectedStatus(e.target.value)}
					className="w-full bg-[#0f172a] border border-white/10 text-white rounded-2xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
				>
					<option value="">Choisir un statut</option>

					{statuses.map((s) => (
						<option key={s.id} value={s.id} className="bg-[#0f172a]">
							{s.status}
						</option>
					))}
				</select>
			</div>

			<div className="mb-5">
				<label className="block text-sm font-medium text-gray-300 mb-2">
					Réponse
				</label>

				<textarea
					value={reponse}
					onChange={(e) => setReponse(e.target.value)}
					rows={5}
					placeholder="Écrire une réponse..."
					className="w-full bg-[#0f172a] border border-white/10 text-white rounded-2xl p-4 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
				/>
			</div>

			<div className="flex justify-end">
				<button
					onClick={traiterReclamation}
					className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
				>
					Enregistrer
				</button>
			</div>
		</div>
	);
}
