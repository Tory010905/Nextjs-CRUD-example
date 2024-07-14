"use client"
import {  AddNewTodoList, GetListsForUser } from "@/handlers/listHandlers";
import { useEffect, useState } from "react";
import { TodoList, TodoListData } from "./todoList";
import { AddNewListBtn } from "./addNewListBtn";

export const ListGrid = () => {
    const [username, setUsername] = useState("");
    const [noteList, setNoteList] = useState<TodoListData[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            GetListsForUser({
                username : username,
                onFetchComplete : (response) => {
                    setNoteList(response);
                    setLoading(false);
                }
            })
        }, 0);
        
        return () => clearTimeout(timer);
    }, [username])


    const handleAddNewNote = () => {
        if(username === ""){
            alert("select valid username first");
            return;
        }

        let newTodoList : TodoListData = {
            id : 0,
            username : username,
            title : "Example name",
            tasks : []
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

            
                {
                    loading ?
                        <p>
                            Loading todo lists for user {username}
                        </p>
                        :
                        noteList?.map((listData) => {
                            return <TodoList key={listData.id} {...listData} onListDelete={handleDeleteNote}/>
                        })
                }
            
            <div className="fixed bottom-4 right-4">
                <AddNewListBtn onClick={handleAddNewNote}/>
            </div>
            
        </>
    )
}