"use client"
import {  AddNewTodoList, GetListsForUser } from "@/handlers/listHandlers";
import { useEffect, useState } from "react";
import { TodoList, TodoListData, TodoListProps } from "./todoList";
import { AddButton } from "./addButton";

export const ListGrid = () => {
    const [username, setUsername] = useState("");
    const [listArray, setListArray] = useState<TodoListProps[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            GetListsForUser({
                username : username,
                onFetchComplete : (response) => {
                    setListArray(response.map(list => {
                        return {
                            ...list,
                            onListDelete : (id) => handleDeleteList(id), 
                        }
                    }));
                    setLoading(false);
                }
            })
        }, 0);
        
        return () => clearTimeout(timer);
    }, [username])


    const handleAddNewList = () => {
        if(username === ""){
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
                setListArray(array => [...array, {
                    ...validData,
                    onListDelete : (id) => handleDeleteList(id),
                    editMode : true
                }])
            }
        });
    }

    const handleDeleteList = (id : number) => {
        let filteredList = listArray.filter(x => x.id != id);
        setListArray(filteredList);
    }

    return (
        <>
            <div className="flex justify-center items-center gap-x-[8px]">
                <input 
                    className="px-[8px] py-[6px] rounded-full border-2 border-black"
                    value={username}
                    placeholder="Type your username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
                {
                    loading ?
                        <p>
                            Loading todo lists for user {username}
                        </p>
                        :
                        listArray && listArray.length > 0 ?
                            listArray.map((listData) => {
                                return <TodoList key={listData.id} {...listData}/>
                            })
                        :
                        username.length > 0 ?
                        <div className="h-[400px] flex justify-center items-center px-[10%]">
                            <div className="text-center">
                            <p className="md:text-3xl">Looks like user <b>{username}</b> has no task lists.</p>
                            <p className="md:text-2xl">You can add one by clicking button bellow</p>
                            </div>
                        </div>
                        :
                        <div className="h-[400px] flex justify-center items-center px-[10%]">
                            <div className="text-center">
                                <p className="md:text-3xl text-2xl font-bold">Welcome to my simple Task Organizer</p>
                                <p className="md:text-2xl text-xl">To start, simply type your desired username to the input bar above</p>
                            </div>
                        </div>
                        
                }
            {username.length > 0 &&
                <div className="fixed bottom-[50px]">
                    <AddButton text={"Add Task List"} onClick={handleAddNewList}/>
                </div>
            }     
        </>
    )
}