"use client"
import { useState } from "react"
import { Tag, TagProps } from "./tag"
import moment from "moment"
import { DeleteTodoTaskFromList, UpdateTodoTaskFromList } from "@/handlers/taskHandlers"

export enum PriorityEnum {
    NONE,
    LOW,
    MEDIUM,
    HIGH,
    EXTREME
}


export interface TodoTaskData {
    id : number
    todoListId : number
    text : string,
    completed : boolean,
    tags? : string[]
    dueDate? : Date,
    priority? : PriorityEnum
}

interface TodoTaskProps extends TodoTaskData {
    onDelete : () => void 

}

export const TodoTask = (props : TodoTaskProps) => {

    const [originalText, setOriginalText] = useState(props.text);
    const [newText, setNewText] = useState(props.text);
    const [editMode, setEditMode] = useState(false);
    const [completed, setCompleted] = useState<boolean>(props.completed ?? false);
    const [dueDate, setDueDate] = useState<Date | undefined>(props.dueDate);
    const [priority, setPriority] = useState<PriorityEnum | undefined>(props.priority);
    const [tags, setTags] = useState<string[]>(props.tags ?? []);

    const [hover, setHover] = useState<boolean>(false);

    const handleUndoClick = () => {
        setNewText(originalText);

        setEditMode(false);
    }
    
    const handleTaskUpdate = () => {
        UpdateTodoTaskFromList({
            taskData : {
                completed : completed,
                id : props.id,
                text : newText,
                todoListId : props.todoListId,
                dueDate : dueDate,
                priority : priority,
                tags : tags
            }
        });


        setOriginalText(newText);

        setEditMode(false);
    }

    // const handleCompleted = (params : TodoListData) => {
    //     UpdateTodoList({
    //         listData : params
    //     });

    //     setCompleted(params.completed ?? false);
    // }

    // const handleKeyDown = (e : KeyboardEvent<HTMLTextAreaElement>) => {
    //     switch(e.key){
    //         case "Escape": handleUndoClick(); break;
    //         case "Enter" : 
    //             if(e.shiftKey){
    //                 break;
    //             }

    //             handleTextUpdate({
    //                 id : props.id,
    //                 text : newText,
    //                 username : props.username
    //             })
    //             break;
    //         default: break;
    //     }
    // }

    // const handleDelete = () => {
    //     props.onListDelete(props.id);

    //     DeleteTodoList({
    //         id : props.id
    //     });
    // }


    // //preparing data for tags
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

    return(
        <div> 
            <div className="flex justify-between item-center p-[4px] border-b-[1px]">
                <div className="flex-grow overflow-hidden">
                    {editMode ?
                            <div className="flex gap-x-[4px]">
                                <p>text: </p>
                                <input 
                                    className="truncate overflow-hidden whitespace-nowrap block"
                                    defaultValue={originalText}
                                    value={newText}
                                    onChange={e => setNewText(e.target.value)}
                                />
                            </div>
                            :
                            <h3 className="truncate overflow-hidden whitespace-nowrap block">
                                {originalText}
                            </h3>
                        
                    }
                </div>

                <div className="flex justify-end items-center gap-x-[8px] flex-shrink-0">
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
                                onClick={() => handleTaskUpdate()}
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
                        onClick={() => props.onDelete()}
                    /> 
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
    )

    /*
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
                                    //onClick={() => handleUndoClick()}
                                />

                                <img 
                                    className="w-[24px] h-[24px] p-[4px] rounded-full hover:bg-yellow-300"
                                    src="confirm.svg"
                                    alt="confirm-button"
                                    // onClick={() => handleTextUpdate({
                                    //     id : props.id,
                                    //     text : newText,
                                    //     username : props.username,
                                    //     completed : completed
                                    // })}
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
                            //onClick={() => handleDelete()}
                        /> 
                    </div>
                </div>

                
            </div>
            
            
        </div>
        
    )
        */
}