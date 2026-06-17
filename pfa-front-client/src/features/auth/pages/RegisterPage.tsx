import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft, UserPlus } from "lucide-react";

import { registerClient } from "../services/auth.service";

export default function RegisterPage() {
	const navigate = useNavigate();

	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [email, setEmail] = useState("");
	const [telephone, setTelephone] = useState("");
	const [adresse, setAdresse] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [showPw, setShowPw] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const inputStyle =
		"w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-500 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");
		setSuccess("");

		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}

		try {
			setLoading(true);

			await registerClient({
				adresse,
				telephone,
				user: {
					nom,
					prenom,
					email,
					password,
				},
			});

			setSuccess("Compte créé avec succès. Redirection...");

			setTimeout(() => {
				navigate("/login");
			}, 1500);
		} catch (err: any) {
			setError(
				err?.response?.data?.message || "Erreur lors de la création du compte",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0c1222] flex items-center justify-center px-4 py-8 relative overflow-hidden">
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
					backgroundSize: "32px 32px",
				}}
			/>

			<div className="absolute top-[15%] -left-[10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
			<div className="absolute bottom-[10%] -right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />

			<div className="relative z-10 w-full max-w-4xl">
				<button
					onClick={() => navigate("/login")}
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-5"
				>
					<ChevronLeft size={16} />
					Retour
				</button>

				<div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
					<div className="grid md:grid-cols-2">
						<div className="hidden md:flex flex-col justify-center p-10 border-r border-white/[0.06]">
							<img
								src="/logo.png"
								alt="logo"
								className="h-12 w-fit mb-8"
								style={{ filter: "brightness(0) invert(1)" }}
							/>

							<h1 className="text-3xl font-bold text-white leading-tight">
								Créez votre espace client
							</h1>

							<p className="text-slate-400 mt-4 leading-relaxed">
								Déposez vos réclamations, suivez leur évolution et échangez avec
								nos agents directement depuis votre tableau de bord.
							</p>

							<div className="flex gap-8 mt-10">
								<div>
									<div className="text-white text-xl font-bold">24/7</div>
									<div className="text-slate-500 text-xs">Disponible</div>
								</div>

								<div>
									<div className="text-white text-xl font-bold">98%</div>
									<div className="text-slate-500 text-xs">Résolution</div>
								</div>

								<div>
									<div className="text-white text-xl font-bold">2.4h</div>
									<div className="text-slate-500 text-xs">Temps moyen</div>
								</div>
							</div>
						</div>

						<div className="p-8">
							<div className="mb-8">
								<h2 className="text-2xl font-bold text-white">Inscription</h2>

								<p className="text-slate-400 mt-1">
									Remplissez les informations ci-dessous
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								className="grid grid-cols-1 md:grid-cols-2 gap-5"
							>
								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Nom
									</label>

									<input
										type="text"
										value={nom}
										onChange={(e) => setNom(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Prénom
									</label>

									<input
										type="text"
										value={prenom}
										onChange={(e) => setPrenom(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Email
									</label>

									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Téléphone
									</label>

									<input
										type="text"
										value={telephone}
										onChange={(e) => setTelephone(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm text-slate-300 mb-2">
										Adresse
									</label>

									<input
										type="text"
										value={adresse}
										onChange={(e) => setAdresse(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Mot de passe
									</label>

									<div className="relative">
										<input
											type={showPw ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className={inputStyle}
											required
										/>

										<button
											type="button"
											onClick={() => setShowPw(!showPw)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
										>
											{showPw ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								</div>

								<div>
									<label className="block text-sm text-slate-300 mb-2">
										Confirmation
									</label>

									<input
										type={showPw ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>

								{error && (
									<div className="md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm">
										{error}
									</div>
								)}

								{success && (
									<div className="md:col-span-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-3 text-sm">
										{success}
									</div>
								)}

								<div className="md:col-span-2">
									<button
										type="submit"
										disabled={loading}
										className="
                      w-full
                      h-12
                      rounded-xl
                      bg-gradient-to-r
                      from-teal-500
                      to-cyan-500
                      text-white
                      font-semibold
                      shadow-lg
                      shadow-teal-500/20
                      hover:scale-[1.01]
                      transition-all
                      disabled:opacity-50
                    "
									>
										{loading ? (
											"Création du compte..."
										) : (
											<span className="flex items-center justify-center gap-2">
												<UserPlus size={18} />
												Créer mon compte
											</span>
										)}
									</button>
								</div>
							</form>

							<div className="text-center mt-6">
								<Link
									to="/login"
									className="text-teal-400 hover:text-teal-300 text-sm"
								>
									Déjà un compte ? Se connecter
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
