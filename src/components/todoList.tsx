'use client'

import { DeleteTodoList } from "@/handlers/apiHandlers"

export interface TodoListData {
    id : number,
    text : string,
    username : string,
}

export interface TodoListProps extends TodoListData  {
    onListDelete : (id : number) => void
}

export const TodoList = (props : TodoListProps) => {
    return (
        <div className="relative">

            <div className="bg-yellow-600 h-[300px] w-[200px] p-8">
                <div className="flex justify-between">
                    <p>{props.id} {props.username}</p>

                    <img 
                        className="w-[24px] h-[24px] cursor-pointer"
                        src="trashcan.svg"
                        alt="delete-button"
                        onClick={() => DeleteTodoList({
                            id : props.id,
                            onFetchComplete : () => props.onListDelete(props.id)
                        })}
                    />
                </div>
                <p>
                    {props.text}
                </p>
            </div>
        </div>
    )
}