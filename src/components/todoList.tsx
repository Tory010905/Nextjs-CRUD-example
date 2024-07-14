'use client'

import { TodoTask, TodoTaskData, TodoTaskProps } from "./todoTask";
import { AddTodoTaskToList, DeleteTodoTaskFromList } from "@/handlers/taskHandlers";
import { AddButton } from "./addButton";
import { useEffect, useState } from "react";
import { UpdateTodoList } from "@/handlers/listHandlers";

export interface TodoListData {
    id : number,
    username : string,
    title : string,
    tasks : TodoTaskData[]
}

export interface TodoListProps extends TodoListData  {
    onListDelete : (id : number) => void
    editMode? : boolean
}

export const TodoList = (props : TodoListProps) => {

    const [tasks, setTasks] = useState<TodoTaskProps[]>(props.tasks?.map(task => {
        return {
            ...task,
            onDelete : () => handleTaskDelete(task.id)
        }
    }));

    const [editMode, setEditMode] = useState(props.editMode ?? false);
    const [originalTitle, setOriginalTitle] = useState(props.title);
    const [newTitle, setNewTitle] = useState(props.title);

    useEffect(() => {
        setNewTitle(originalTitle);
    }, [editMode])

    const handleTitleUpdate = () => {
        setOriginalTitle(newTitle);

        UpdateTodoList({
            listData : {
                id : props.id,
                tasks : tasks,
                title : originalTitle,
                username : props.username
            }
        })

        setEditMode(false);
    }

    const handleEditUndo = () => {
        setEditMode(false);
    }

    const handleAddTask = () => {
        AddTodoTaskToList({
            listId : props.id,
            taskData : {
                completed : false,
                id : 0,
                todoListId : props.id,
                text : "Example Text",
                priority : null,
                dueDate : null
            },
            onFetchComplete : (validData) => {
                setTasks(tasks => [...tasks, {
                    ...validData,
                    onDelete : () => handleTaskDelete(validData.id),
                    editMode : true
                }])
            }
        })
    }

    const handleTaskDelete = (taskId : number) => {
        let deletedTask = {...tasks.filter(x => x.id === taskId)[0]};

        let filteredTasks= tasks.filter(x => x.id !== taskId);
        setTasks(filteredTasks);

        DeleteTodoTaskFromList({
            id : taskId,
            listId : props.id,
            onError : () => {
                setTasks(tasks => [...tasks, deletedTask])
            }
        })
    }
    

    return (

        <div className="flex-col justify-center items-center border-[2px] border-black md:rounded-t-3xl rounded-t-xl md:rounded-b-2xl rounded-b-sm w-full">
                <div className="flex justify-between border-b-[2px] border-black px-[10px]">
                    <div className="md:text-2xl text-lg flex-1 ml-[16px] overflow-x-hidden">
                        {editMode ? 
                            <input 
                            className="w-[100%]"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />
                            :
                            <h3 className="w-[100%] font-bold">
                                {originalTitle}
                            </h3>
                        }
                        
                    </div>
                    

                    <div className="flex flex-shrink-0 justify-end items-center w-[100px]">
                        {editMode ?
                            <>
                                <img
                                    src="undo.svg"
                                    alt="edit-title-button"
                                    className="w-[32px] h-[32px] p-[8px]"
                                    onClick={() => handleEditUndo()}
                                    
                                />
                                <img
                                    src="confirm.svg"
                                    alt="edit-title-button"
                                    className="w-[32px] h-[32px] p-[8px]"
                                    onClick={() => handleTitleUpdate()}
                                />
                            </>
                            :
                            <img
                                src="edit.svg"
                                alt="edit-title-button"
                                className="w-[32px] h-[32px] p-[8px] cursor-pointer"
                                onClick={() => setEditMode(true)}
                            />
                        }
                        
                        <img
                            src="trashcan.svg"
                            alt="delete-list-button"
                            className="w-[32px] h-[32px] p-[8px]"
                            onClick={() => props.onListDelete(props.id)}
                        />
                    </div>
                </div>

                <ul>
                    {tasks?.map(task => {
                        return (
                            <li key={`${props.id}-${task.id}`}>
                                <TodoTask {...task}/>
                            </li>
                        )
                    })}
                </ul>

                <div className="flex justify-center items-center">
                    <AddButton
                        onClick={() => handleAddTask()}
                        text="Add New Task"
                    />
                </div>
        </div>
    )
}