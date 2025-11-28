"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
	latitude: number | null;
	longitude: number | null;
	accuracy: number | null;
	isLoading: boolean;
	error: string | null;
	isSupported: boolean;
}

interface UseGeolocationOptions {
	enableHighAccuracy?: boolean;
	timeout?: number;
	maximumAge?: number;
}

/* Hook pour obtenir la position GPS de l'utilisateur */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState {
	const [state, setState] = useState<GeolocationState>({
		latitude: null,
		longitude: null,
		accuracy: null,
		isLoading: true,
		error: null,
		isSupported: true,
	});

	useEffect(() => {
		// Vérifie si la géolocalisation est supportée
		if (!navigator.geolocation) {
			setState((prev) => ({
				...prev,
				isLoading: false,
				isSupported: false,
				error: "Géolocalisation non supportée",
			}));
			return;
		}

		const {
			enableHighAccuracy = false,
			timeout = 10000,
			maximumAge = 5 * 60 * 1000, // 5 minutes
		} = options;

		// Succès : on a la position
		const onSuccess = (position: GeolocationPosition) => {
			setState({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				accuracy: position.coords.accuracy,
				isLoading: false,
				error: null,
				isSupported: true,
			});
		};

		// Erreur : l'utilisateur a refusé ou autre problème
		const onError = (error: GeolocationPositionError) => {
			let errorMessage: string;

			switch (error.code) {
				case error.PERMISSION_DENIED:
					errorMessage = "Permission refusée";
					break;
				case error.POSITION_UNAVAILABLE:
					errorMessage = "Position indisponible";
					break;
				case error.TIMEOUT:
					errorMessage = "Délai dépassé";
					break;
				default:
					errorMessage = "Erreur inconnue";
			}

			setState((prev) => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));
		};

		// Demande la position
		navigator.geolocation.getCurrentPosition(onSuccess, onError, {
			enableHighAccuracy,
			timeout,
			maximumAge,
		});
	}, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

	return state;
}
