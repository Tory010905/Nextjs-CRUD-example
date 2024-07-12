import { AddNewListBtn } from "@/components/addNewListBtn";
import { ListGrid } from "@/components/listGrid";
import { TodoList, TodoListProps } from "@/components/todoList";
import { GetLists, GetListsForUser } from "@/handlers/apiHandlers";

export const dynamic = 'force-dynamic'

export default async function Home() {

	return (
		<main className="flex flex-col relative min-h-screen max-h-screen">
			<div className="bg-red-400 flex justify-center ">
				<AddNewListBtn/>
			</div>
			<div className="bg-gray-800 flex min-h-screen flex-col items-center justify-between p-24">
				<ListGrid />
			</div>
		</main>
	);
}
