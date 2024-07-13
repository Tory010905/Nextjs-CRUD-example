'use client'

import { DeleteTodoList, UpdateTodoList } from "@/handlers/apiHandlers"
import moment from "moment";
import { useEffect, useState, KeyboardEvent, useRef, TextareaHTMLAttributes } from "react";
import { Tag, TagProps } from "./tag";

export enum PriorityEnum {
    NONE,
    LOW,
    MEDIUM,
    HIGH,
    EXTREME
}

function PriorityToHexColor(priority : PriorityEnum){
    switch(priority){
        case PriorityEnum.NONE: return "#000000"; 
        case PriorityEnum.LOW : return "#"
    }
}

export interface TodoListData {
    id : number,
    text : string,
    username : string,
    completed? : boolean
    tags? : string[],
    dueDate? : Date,
    priority? : PriorityEnum,
}
    

export interface TodoListProps extends TodoListData  {
    onListDelete : (id : number) => void
}

export const TodoList = (props : TodoListProps) => {
    
    const [originalText, setOriginalText] = useState(props.text);
    const [newText, setNewText] = useState(props.text);
    const [editMode, setEditMode] = useState(false);
    const [completed, setCompleted] = useState<boolean>(props.completed ?? false);
    const [hover, setHover] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // useEffect(() => {
    //     setEdited(newText != originalText);
    // }, [newText, originalText]);

    const handleUndoClick = () => {
        setNewText(originalText);

        setEditMode(false);
    }
    
    const handleTextUpdate = (params : TodoListData) => {
        UpdateTodoList({
            listData : params
        });


        setOriginalText(newText);

        setEditMode(false);
    }

    const handleCompleted = (params : TodoListData) => {
        UpdateTodoList({
            listData : params
        });

        setCompleted(params.completed ?? false);
    }

    const handleKeyDown = (e : KeyboardEvent<HTMLTextAreaElement>) => {
        switch(e.key){
            case "Escape": handleUndoClick(); break;
            case "Enter" : 
                if(e.shiftKey){
                    break;
                }

                handleTextUpdate({
                    id : props.id,
                    text : newText,
                    username : props.username
                })
                break;
            default: break;
        }
    }

    const handleDelete = () => {
        props.onListDelete(props.id);

        DeleteTodoList({
            id : props.id
        });
    }


    //preparing data for tags
    const tagsData : TagProps[] = [];
    if(props.priority){
        tagsData.push({
            text : props.priority.toString()
        })
    }

    if(props.dueDate){
        tagsData.push({
            iconPath : "calender.svg",
            text : moment(props.dueDate).format("DD.MM.YYYY")
        })
    }

    props.tags?.map(tag => {
        tagsData.push({
            text : tag
        });
    })



    return (
        <div className="px-[12px] py-[10px] w-[500px] border-b-[1px]">
            <div className="flex gap-x-[10px] justify-stretch items-center "
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                >
                <div>
                    <input 
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => handleCompleted({
                            id : props.id,
                            text : newText,
                            username : props.username,
                            completed : e.target.checked
                        })}
                        disabled={editMode}
                    />
                </div>

                <div className="flex flex-grow justify-between items-center">
                    <div>
                        <p className="text-lg">{props.username}</p>

                        {editMode ? 
                            <input 
                                className="placeholder:text-gray-900 bg-yellow-600 flex flex-grow"
                                defaultValue={newText}
                                placeholder="write your note"
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                            />
                            :
                            <p className="text-md">{newText}</p>
                        }
                        
                    </div>
                    
                    <div className={`${!hover && !editMode && "invisible"} flex gap-x-[4px]`}>

                        {editMode ?
                            <>
                                <img 
                                    className="w-[24px] h-[24px] p-[4px] rounded-full hover:bg-yellow-300"
                                    src="undo.svg"
                                    alt="undo-button"
                                    onClick={() => handleUndoClick()}
                                />

                                <img 
                                    className="w-[24px] h-[24px] p-[4px] rounded-full hover:bg-yellow-300"
                                    src="confirm.svg"
                                    alt="confirm-button"
                                    onClick={() => handleTextUpdate({
                                        id : props.id,
                                        text : newText,
                                        username : props.username,
                                        completed : completed
                                    })}
                                />                           
                            </>
                            :
                            <img 
                                className={`w-[24px] h-[24px] cursor-pointer`}
                                src="edit.svg"
                                alt="edit-button"
                                onClick={() => setEditMode(true)}
                            /> 
                        }
                        

                        <img 
                            className={`w-[24px] h-[24px] cursor-pointer`}
                            src="trashcan.svg"
                            alt="delete-button"
                            onClick={() => handleDelete()}
                        /> 
                    </div>
                </div>

                
            </div>
            
            <ul className="inline space-x-[4px] space-y-[2px]">
                {tagsData.map((tag, key) => {
                    return (
                        <li key={key} className="inline h-full">
                            <Tag {...tag}/>
                        </li>
                    )
                })}
            </ul>
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