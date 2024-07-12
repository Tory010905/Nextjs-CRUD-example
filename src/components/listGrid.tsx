"use client"
import { API_ROUTE, AddNewTodoList, GetListsForUser } from "@/handlers/apiHandlers";
import { useEffect, useState } from "react";
import { TodoList, TodoListData, TodoListProps } from "./todoList";
import { AddNewListBtn } from "./addNewListBtn";
import { debug } from "console";

export const ListGrid = () => {
    const [username, setUsername] = useState("");
    const [noteList, setNoteList] = useState<TodoListData[]>([])

    useEffect(() => {
        const timer = setTimeout(() => {
            GetListsForUser({
                username : username,
                onFetchComplete : (response) => {
                    setNoteList(response);
                }
            })
        }, 300);
        
        return () => clearTimeout(timer);
    }, [username])


    const handleAddNewNote = () => {
        if(username === ""){
            alert("select valid username first");
            return;
        }

        let newTodoList : TodoListData = {
            id : 0,
            text : "example text",
            username : username,
        };

        AddNewTodoList({
            listData : newTodoList,
            onFetchComplete : (validData) => {
                setNoteList(array => [...array, validData])
            }
        });
    }

    const handleDeleteNote = (id : number) => {
        let filteredList = noteList.filter(x => x.id != id);
        setNoteList(filteredList);
    }

    return (
        <>
            <input 
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {
                    Array.isArray(noteList) && noteList?.map((listData, key) => {
                        return <TodoList key={key} {...listData} onListDelete={handleDeleteNote}/>
                    })
                }
            </div>
            
            <div className="fixed bottom-4 right-4">
                <AddNewListBtn onClick={handleAddNewNote}/>
            </div>
            
        </>
    )
}