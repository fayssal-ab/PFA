import { FileText, Paperclip, Download, Trash2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { PieceJointe } from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";

type Props = {
	agentFiles: PieceJointe[];
	downloadFile: (filename?: string) => void;
	uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	deleteFile: (id: number) => void;
};

export default function AgentFilesSection({
	agentFiles,
	downloadFile,
	uploadFile,
	uploading,
	page,
	totalPages,
	onPageChange,
	deleteFile,
}: Props) {
	const { user } = useAuth();
	const isAgent = user?.role === "agent" || user?.role?.includes("agent");

	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center">
						<FileText size={15} className="text-emerald-600" />
					</div>
					<div>
						<h2 className="text-sm font-bold text-slate-900">
							{isAgent ? "Mes pièces jointes" : "Pièces jointes agent"}
						</h2>
						<p className="text-[11px] text-slate-500">{agentFiles.length} fichier{agentFiles.length !== 1 ? "s" : ""}</p>
					</div>
				</div>

				{isAgent && (
					<label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
						uploading
							? "bg-slate-50 text-slate-400 cursor-wait"
							: "bg-teal-600 text-white hover:bg-teal-700"
					}`}>
						{uploading ? (
							<>
								<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Envoi...
							</>
						) : (
							<>
								<Upload size={12} />
								Ajouter
							</>
						)}
						<input type="file" className="hidden" onChange={uploadFile} disabled={uploading} />
					</label>
				)}
			</div>

			<div className="p-4 space-y-2">
				{agentFiles.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-3">
							<Paperclip size={20} className="text-slate-400" />
						</div>
						<p className="text-sm text-slate-500">Aucun fichier joint</p>
						{isAgent && (
							<p className="text-xs text-slate-400 mt-1">Cliquez sur "Ajouter" pour joindre un fichier</p>
						)}
					</div>
				) : (
					agentFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 transition-all group"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
									<Paperclip size={13} className="text-emerald-600" />
								</div>
								<p className="text-sm text-slate-700 truncate font-medium">{f.fichier}</p>
							</div>
							<div className="flex items-center gap-1.5 shrink-0 ml-2">
								<button
									onClick={() => downloadFile(f.fichier)}
									title="Télécharger"
									className="w-8 h-8 rounded-md bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-all border border-slate-200"
								>
									<Download size={14} />
								</button>
								{isAgent && (
									<button
										onClick={() => deleteFile(f.id)}
										title="Supprimer"
										className="w-8 h-8 rounded-md bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all border border-slate-200"
									>
										<Trash2 size={14} />
									</button>
								)}
							</div>
						</div>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="px-4 pb-4 flex items-center justify-center gap-2">
					<button
						disabled={page === 0}
						onClick={() => onPageChange(page - 1)}
						className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronLeft size={14} />
					</button>
					<span className="text-xs text-slate-500 font-medium px-2">
						{page + 1} / {Math.max(totalPages, 1)}
					</span>
					<button
						disabled={page + 1 >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronRight size={14} />
					</button>
				</div>
			)}
		</div>
	);
}
