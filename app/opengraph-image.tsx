import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Shift - Paysage Pixel Art Génératif";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				{/* Ciel dégradé */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: "55%",
						background: "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 60%, #E0F4FF 100%)",
					}}
				/>

				{/* Sol dégradé */}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: "45%",
						background: "linear-gradient(180deg, #90EE90 0%, #228B22 50%, #1B5E20 100%)",
					}}
				/>

				{/* Soleil */}
				<div
					style={{
						position: "absolute",
						top: "60px",
						right: "120px",
						width: "100px",
						height: "100px",
						borderRadius: "50%",
						background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
						boxShadow: "0 0 60px 20px rgba(255, 215, 0, 0.4)",
					}}
				/>

				{/* Nuages */}
				<div
					style={{
						position: "absolute",
						top: "80px",
						left: "100px",
						display: "flex",
						gap: "-20px",
					}}
				>
					<div
						style={{
							width: "80px",
							height: "50px",
							borderRadius: "25px",
							background: "rgba(255, 255, 255, 0.9)",
						}}
					/>
					<div
						style={{
							width: "100px",
							height: "60px",
							borderRadius: "30px",
							background: "rgba(255, 255, 255, 0.95)",
							marginLeft: "-30px",
							marginTop: "-10px",
						}}
					/>
					<div
						style={{
							width: "70px",
							height: "45px",
							borderRadius: "22px",
							background: "rgba(255, 255, 255, 0.85)",
							marginLeft: "-25px",
							marginTop: "5px",
						}}
					/>
				</div>

				{/* Petit nuage */}
				<div
					style={{
						position: "absolute",
						top: "140px",
						left: "500px",
						display: "flex",
					}}
				>
					<div
						style={{
							width: "60px",
							height: "35px",
							borderRadius: "17px",
							background: "rgba(255, 255, 255, 0.8)",
						}}
					/>
					<div
						style={{
							width: "45px",
							height: "30px",
							borderRadius: "15px",
							background: "rgba(255, 255, 255, 0.75)",
							marginLeft: "-15px",
						}}
					/>
				</div>

				{/* Collines arrière-plan */}
				<div
					style={{
						position: "absolute",
						top: "280px",
						left: "-50px",
						width: "500px",
						height: "200px",
						borderRadius: "50% 50% 0 0",
						background: "#3CB371",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "300px",
						right: "-30px",
						width: "450px",
						height: "180px",
						borderRadius: "50% 50% 0 0",
						background: "#2E8B57",
					}}
				/>

				{/* Maison */}
				<div
					style={{
						position: "absolute",
						top: "290px",
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Cheminée */}
					<div
						style={{
							position: "absolute",
							top: "-20px",
							right: "30px",
							width: "25px",
							height: "40px",
							background: "#8B4513",
						}}
					/>
					{/* Toit */}
					<div
						style={{
							width: "0",
							height: "0",
							borderLeft: "90px solid transparent",
							borderRight: "90px solid transparent",
							borderBottom: "70px solid #8B0000",
						}}
					/>
					{/* Corps de la maison */}
					<div
						style={{
							width: "160px",
							height: "100px",
							background: "#DEB887",
							display: "flex",
							alignItems: "flex-end",
							justifyContent: "center",
							paddingBottom: "10px",
							gap: "30px",
						}}
					>
						{/* Fenêtre gauche */}
						<div
							style={{
								width: "35px",
								height: "35px",
								background: "#87CEEB",
								border: "3px solid #654321",
								marginBottom: "30px",
							}}
						/>
						{/* Porte */}
						<div
							style={{
								width: "40px",
								height: "65px",
								background: "#654321",
								borderRadius: "20px 20px 0 0",
							}}
						/>
						{/* Fenêtre droite */}
						<div
							style={{
								width: "35px",
								height: "35px",
								background: "#87CEEB",
								border: "3px solid #654321",
								marginBottom: "30px",
							}}
						/>
					</div>
				</div>

				{/* Arbre gauche */}
				<div
					style={{
						position: "absolute",
						top: "260px",
						left: "180px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Feuillage */}
					<div
						style={{
							width: "100px",
							height: "120px",
							background: "#228B22",
							borderRadius: "50% 50% 45% 45%",
						}}
					/>
					{/* Tronc */}
					<div
						style={{
							width: "25px",
							height: "60px",
							background: "#8B4513",
							marginTop: "-10px",
						}}
					/>
				</div>

				{/* Arbre droit */}
				<div
					style={{
						position: "absolute",
						top: "280px",
						right: "150px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Feuillage */}
					<div
						style={{
							width: "80px",
							height: "100px",
							background: "#2E8B57",
							borderRadius: "50% 50% 45% 45%",
						}}
					/>
					{/* Tronc */}
					<div
						style={{
							width: "20px",
							height: "50px",
							background: "#8B4513",
							marginTop: "-8px",
						}}
					/>
				</div>

				{/* Buissons */}
				<div
					style={{
						position: "absolute",
						bottom: "140px",
						left: "320px",
						width: "50px",
						height: "35px",
						background: "#32CD32",
						borderRadius: "50%",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "135px",
						right: "280px",
						width: "45px",
						height: "30px",
						background: "#3CB371",
						borderRadius: "50%",
					}}
				/>

				{/* Rivière */}
				<div
					style={{
						position: "absolute",
						bottom: "60px",
						left: 0,
						right: 0,
						height: "50px",
						background: "linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)",
					}}
				/>

				{/* Berge sud */}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: "60px",
						background: "#228B22",
					}}
				/>

				{/* Titre et sous-titre */}
				<div
					style={{
						position: "absolute",
						bottom: "30px",
						left: "50px",
						display: "flex",
						flexDirection: "column",
						gap: "8px",
					}}
				>
					<div
						style={{
							fontSize: "64px",
							fontWeight: "bold",
							color: "#FFFFFF",
							textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
							letterSpacing: "-1px",
						}}
					>
						Shift
					</div>
					<div
						style={{
							fontSize: "24px",
							color: "#FFFFFF",
							textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
						}}
					>
						Paysage Pixel Art Génératif
					</div>
				</div>

				{/* Badge météo/temps réel */}
				<div
					style={{
						position: "absolute",
						bottom: "40px",
						right: "50px",
						display: "flex",
						alignItems: "center",
						gap: "12px",
						background: "rgba(255, 255, 255, 0.9)",
						padding: "12px 20px",
						borderRadius: "30px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					}}
				>
					<span style={{ fontSize: "28px" }}>🌦️</span>
					<span style={{ fontSize: "18px", color: "#333", fontWeight: "500" }}>
						Météo en temps réel
					</span>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
