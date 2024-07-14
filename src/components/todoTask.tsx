"use client"
import { useEffect, useState, KeyboardEvent, useDebugValue } from "react"
import { Tag, TagData, TagProps } from "./todoTask/tag"
import moment from "moment"
import { DeleteTodoTaskFromList, UpdateTodoTaskFromList } from "@/handlers/taskHandlers"
import { BackgroundlessInput } from "./utils/backgroundlessInput"
import { AddTag } from "./todoTask/addTag"

export enum PriorityEnum {
    NONE,
    LOW,
    MEDIUM,
    HIGH,
    EXTREME
}


export interface TodoTaskData {
    id: number
    todoListId: number
    text: string,
    completed: boolean,
    tags?: string[]
    dueDate?: Date | null,
    priority?: PriorityEnum | null
}

interface TodoTaskProps extends TodoTaskData {
    onDelete: () => void

}

export const TodoTask = (props: TodoTaskProps) => {

    const [originalTaskData, setOriginalTaskData] = useState<TodoTaskData>(props);
    const [text, setText] = useState(props.text);
    const [editMode, setEditMode] = useState(false);
    const [completed, setCompleted] = useState<boolean>(props.completed ?? false);
    const [dueDate, setDueDate] = useState<Date | undefined>(props.dueDate ?? undefined);
    const [priority, setPriority] = useState<PriorityEnum | undefined>(props.priority ?? undefined);
    const [tags, setTags] = useState<string[]>(props.tags ?? []);

    const initEditMode = () => {
        setText(originalTaskData.text);
        setDueDate(originalTaskData.dueDate ?? undefined);
        setPriority(originalTaskData.priority ?? undefined);
        setTags(originalTaskData.tags ?? []);
    }

    useEffect(() => {
        if (editMode) {
            initEditMode();
        }
    }, [editMode]);

    const handleUndoClick = () => {
        setEditMode(false);
    }

    const handleConfirmEditClick = () => {
        handleTaskUpdate();

        setEditMode(false);
    }

    const handleTaskUpdate = () => {
        let newData: TodoTaskData = {
            completed: completed,
            id: props.id,
            text: text,
            todoListId: props.todoListId,
            dueDate: dueDate ?? null,
            priority: priority ?? null,
            tags: tags
        }

        UpdateTodoTaskFromList({
            taskData: newData
        });

        setOriginalTaskData(newData);
    }

    // useEffect(() => {
    //     console.log(completed, text, dueDate, priority)
    //     handleTaskUpdate();
    // }, [completed, text, dueDate, priority])

    // const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    //     switch (e.key) {
    //         case "Escape": handleUndoClick(); break;
    //         case "Enter":
    //             if (e.shiftKey) {
    //                 break;
    //             }

    //             handleConfirmEditClick();
    //             break;
    //         default: break;
    //     }
    // }

    const handleDelete = () => {
        props.onDelete();
    }

    return (
        <div
            className="p-[4px] border-b-[1px] flex items-center group/task"
        >
            <div className="flex flex-grow-0 px-[4px]">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    disabled={editMode}
                />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-grow justify-between">
                    <div className="overflow-hidden">
                        {editMode ?
                            <div className="flex gap-x-[4px]">
                                <p>text: </p>
                                <BackgroundlessInput
                                    type="text"
                                    classNameCustom="truncate overflow-hidden whitespace-nowrap block"
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                />
                            </div>
                            :
                            <h3 className="truncate overflow-hidden whitespace-nowrap block">
                                {originalTaskData.text}
                            </h3>

                        }
                    </div>


                </div>

                <ul className="space-x-[4px] space-y-[2px]">
                    {priority &&
                        <li key={-2} className="inline h-full">
                            <Tag
                                onDelete={() => {
                                    setPriority(undefined);
                                }}
                                editMode={editMode}

                            >
                                <p>{priority.toString()}</p>
                            </Tag>
                        </li>

                    }

                    {dueDate &&
                        <li key={-1} className="inline h-full">
                            <Tag
                                onDelete={() => {
                                    setDueDate(undefined);
                                }}
                                editMode={editMode}

                                iconPath="calender.svg"
                            >
                                <p>{moment(dueDate).format("DD. MM. YYYY")}</p>
                            </Tag>
                        </li>
                    }

                    {tags.map((tagText, key) => {
                        return (
                            <li key={key} className="inline h-full">
                                <Tag
                                    onDelete={() => {
                                        let filteredTags = tags.filter(x => x != tagText);
                                        setTags(filteredTags);
                                    }}
                                    editMode={editMode}

                                >
                                    <p>{tagText}</p>
                                </Tag>
                            </li>
                        )
                    })}

                    {editMode &&
                        <li key={"addNewTag"} className="inline h-full">
                            <AddTag onEditEnd={(newTag) => {
                                if (newTag.length > 0) {
                                    setTags(tags => [...tags, newTag])
                                }
                            }} />
                        </li>
                    }
                </ul>
            </div>

            <div className={`flex justify-end items-center gap-x-[8px] flex-shrink-0 flex-grow
                            ${!editMode && "group-hover/task:visible invisible"}`}
            >
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
                            onClick={() => handleConfirmEditClick()}
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