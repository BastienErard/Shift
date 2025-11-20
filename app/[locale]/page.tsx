import { useTranslations } from "next-intl";

export default function Home() {
	const t = useTranslations("home");

	return (
		<main className="min-h-screen p-8">
			<h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
			<p className="text-lg text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
		</main>
	);
}
