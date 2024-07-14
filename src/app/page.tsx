import { ListGrid } from "@/components/listGrid";

export default async function Home() {

	return (
		<main className="font-roboto">
			<h1 className="bg-gray-500 p-[12px] text-4xl font-bold">
				Task Organizer
			</h1>

			<div className="bg-gray-100 flex min-h-screen flex-col items-center justify-start md:px-24 md:pb-24 pt-[8px] pb-[50px] gap-y-[8px]">
				<ListGrid />
			</div>

			<footer className="bg-gray-500 flex justify-end text-sm p-[12px]">
				Made by: Tomáš Ryšavý 2024
			</footer>
		</main>
	);
}
