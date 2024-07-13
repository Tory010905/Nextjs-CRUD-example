"use client"
import { API_ROUTE, AddNewTodoList, GetListsForUser } from "@/handlers/apiHandlers";
import { useEffect, useState } from "react";
import { TodoList, TodoListData } from "./todoList";
import { AddNewListBtn } from "./addNewListBtn";

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
            completed : false,
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

            <div className="grid grid-cols-1 border-[1px] rounded-3xl">
                <p className="flex justify-center">TODO LIST #1</p>
                {
                    noteList?.map((listData) => {
                        return <TodoList key={listData.id} {...listData} onListDelete={handleDeleteNote}/>
                    })
                }
            </div>
            
            <div className="fixed bottom-4 right-4">
                <AddNewListBtn onClick={handleAddNewNote}/>
            </div>
            
        </>
    )
}