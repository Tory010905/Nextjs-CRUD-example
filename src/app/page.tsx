import { AddNewListBtn } from "@/components/addNewListBtn";
import { ListGrid } from "@/components/listGrid";
import { TodoList, TodoListProps } from "@/components/todoList";
import { GetLists, GetListsForUser } from "@/handlers/listHandlers";

export const dynamic = 'force-dynamic'

export default async function Home() {

	return (
		<main className="bg-gray-100 flex min-h-screen flex-col items-center justify-start p-24 gap-y-1">
			<ListGrid />
		</main>
	);
}
