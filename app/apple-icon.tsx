import { ImageResponse } from "next/og";

export const size = {
	width: 180,
	height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(180deg, #87CEEB 0%, #90EE90 100%)",
					borderRadius: "32px",
				}}
			>
				{/* Soleil */}
				<div
					style={{
						position: "absolute",
						top: "20px",
						right: "25px",
						width: "40px",
						height: "40px",
						borderRadius: "50%",
						background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
						boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
					}}
				/>

				{/* Collines */}
				<div
					style={{
						position: "absolute",
						bottom: "0",
						left: "0",
						right: "0",
						height: "80px",
						background: "#228B22",
						borderRadius: "50% 50% 0 0",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "0",
						left: "-20px",
						right: "-20px",
						height: "60px",
						background: "#32CD32",
						borderRadius: "50% 50% 0 0",
					}}
				/>

				{/* Maison stylisée */}
				<div
					style={{
						position: "absolute",
						bottom: "45px",
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Toit */}
					<div
						style={{
							width: "0",
							height: "0",
							borderLeft: "35px solid transparent",
							borderRight: "35px solid transparent",
							borderBottom: "30px solid #8B4513",
						}}
					/>
					{/* Corps de la maison */}
					<div
						style={{
							width: "60px",
							height: "45px",
							background: "#DEB887",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{/* Porte */}
						<div
							style={{
								width: "18px",
								height: "30px",
								background: "#654321",
								borderRadius: "8px 8px 0 0",
							}}
						/>
					</div>
				</div>

				{/* Arbre */}
				<div
					style={{
						position: "absolute",
						bottom: "55px",
						left: "30px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Feuillage */}
					<div
						style={{
							width: "30px",
							height: "35px",
							background: "#006400",
							borderRadius: "50% 50% 40% 40%",
						}}
					/>
					{/* Tronc */}
					<div
						style={{
							width: "10px",
							height: "20px",
							background: "#8B4513",
						}}
					/>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
