
import { FileText, Paperclip, Download } from "lucide-react";

import { PieceJointe } from "../../../types";

type Props = {
	agentFiles: PieceJointe[];
	downloadFile: (filename?: string) => void;
	uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploading: boolean;
};

export default function AgentFilesSection({
	agentFiles,
	downloadFile,
	uploadFile,
	uploading,
}: Props) {
	return (
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-2">
					<FileText size={18} className="text-emerald-400" />

					<h2 className="text-lg font-bold text-white">Mes Pièces jointes</h2>
				</div>

				<label className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium cursor-pointer hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
					<Paperclip size={15} />

					{uploading ? "Upload..." : "Ajouter"}

					<input type="file" className="hidden" onChange={uploadFile} />
				</label>
			</div>

			<div className="space-y-3">
				{agentFiles.length === 0 ? (
					<div className="text-sm text-gray-500">Aucun fichier</div>
				) : (
					agentFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between border border-white/10 bg-[#0f172a]/50 rounded-2xl px-4 py-3 hover:border-indigo-500/40 transition-all"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
									<Paperclip size={16} className="text-emerald-300" />
								</div>

								<p className="text-sm font-semibold text-white">{f.fichier}</p>
							</div>

							<button
								onClick={() => downloadFile(f.fichier)}
								className="w-10 h-10 rounded-xl bg-[#1e293b] hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-300 flex items-center justify-center transition-all"
							>
								<Download size={16} />
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
