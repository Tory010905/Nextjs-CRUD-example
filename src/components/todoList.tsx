'use client'

import { DeleteTodoList, UpdateTodoList } from "@/handlers/listHandlers"
import moment from "moment";
import { useEffect, useState, KeyboardEvent, useRef, TextareaHTMLAttributes } from "react";
import { Tag, TagProps } from "./tag";
import { PriorityEnum, TodoTask, TodoTaskData } from "./todoTask";
import { AddTodoTaskToList, DeleteTodoTaskFromList } from "@/handlers/taskHandlers";

function PriorityToHexColor(priority : PriorityEnum){
    switch(priority){
        case PriorityEnum.NONE: return "#000000"; 
        case PriorityEnum.LOW : return "#"
    }
}

export interface TodoListData {
    id : number,
    username : string,
    title : string,
    tasks : TodoTaskData[]
}
    

export interface TodoListProps extends TodoListData  {
    onListDelete : (id : number) => void
}


export const TodoList = (props : TodoListProps) => {

    const [tasks, setTasks] = useState<TodoTaskData[]>(props.tasks);

    const handleAddTask = () => {
        AddTodoTaskToList({
            listId : props.id,
            taskData : {
                completed : false,
                id : 0,
                todoListId : props.id,
                text : "example text"
            },
            onFetchComplete : (validData) => {
                setTasks(array => [...array, validData])
            }
        })
    }

    const handleTaskDelete = (taskId : number) => {
        DeleteTodoTaskFromList({
            id : taskId,
            listId : props.id,
            onFetchComplete : () => {
                let filteredTasks= tasks.filter(x => x.id != taskId);
                setTasks(filteredTasks);
            }
        })
    }
    

    return (

        <div className="flex-col justify-center items-center border-[2px] border-black rounded-t-3xl rounded-b-2xl w-full">
                <p className="flex justify-between border-b-[2px] border-black ">
                    <div></div>
                    <h3>{props.title}</h3>
                    <p>{props.username}</p>
                </p>

                <ul>
                    {tasks?.map(task => {
                        return (
                            <li key={`${props.id}-${task.id}`}>
                                <TodoTask {...task} onDelete={() => handleTaskDelete(task.id)}/>
                            </li>
                        )
                    })}
                </ul>

                <div className="flex justify-center items-center">
                    <button 
                        className=" hover:bg-gray-400 px-[6px] py-[4px] rounded-full"
                        onClick={() => handleAddTask()}
                        >
                        Add New Task
                    </button>
                </div>
        </div>
            
                    
        //</div> <div className="relative  h-[600px] w-[400px]">
        //     {
        //         completed && 
        //         <div 
        //             className="absolute bottom-0 right-0 left-0 top-0 bg-opacity-50 bg-gray-700"
        //             onClick={() => handleCompleted({
        //                 id : props.id,
        //                 text : newText,
        //                 username : props.username,
        //                 completed : false
        //             })}
        //         >
        //             <div className="flex flex-col justify-center items-center h-full">
        //                 Completed
        //             </div>
        //         </div>
        //     }
            

        //     <div className="flex flex-col flex-nowrap h-[600px] justify-between bg-yellow-600 px-[24px] pt-[20px] pb-[16px] rounded-lg">
        //         <div className="flex justify-between">
        //             <p>{props.id} {props.username}</p>                    

        //             <img 
        //                 className="w-[24px] h-[24px] cursor-pointer"
        //                 src="trashcan.svg"
        //                 alt="delete-button"
        //                 onClick={() => handleCompleted({
        //                     id : props.id,
        //                     text : newText,
        //                     username : props.username,
        //                     completed : true
        //                 })}
        //                 // onClick={() => DeleteTodoList({
        //                 //     id : props.id,
        //                 //     onFetchComplete : () => props.onListDelete(props.id)
        //                 // })}
        //             />                
        //         </div>
        //         <div>
        //             <p>Priority: </p>

        //             <p>Due date: <input type="date"/> </p>

        //             <p>Tags: </p>
        //         </div>
        //         <div className="flex flex-col flex-grow">
        //             <textarea
        //                 className="placeholder:text-gray-900 bg-yellow-600 flex flex-grow"
        //                 defaultValue={originalText}
        //                 placeholder="write your note"
        //                 value={newText}
        //                 onChange={(e) => setNewText(e.target.value)}
        //                 onKeyDown={(e) => handleKeyDown(e)}
        //                 ref={textAreaRef}
        //                 >
        //             </textarea>
        //             <div className="flex justify-between flex-grow-0 h-[24px]">
        //                 {
        //                     edited && <>
        //                         <img 
        //                             className="w-[24px] h-[24px] p-[4px] rounded-full hover:bg-yellow-300"
        //                             src="undo.svg"
        //                             onClick={() => handleUndoClick()}
        //                         />

        //                         <img 
        //                             className="w-[24px] h-[24px] p-[4px] rounded-full hover:bg-yellow-300"
        //                             src="confirm.svg"
        //                             onClick={() => handleTextUpdate({
        //                                 id : props.id,
        //                                 text : newText,
        //                                 username : props.username,
        //                                 completed : completed
        //                             })}
        //                         />
        //                     </>
        //                 }
                        
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}