"use client"
import { useEffect, useState, KeyboardEvent, useDebugValue } from "react"
import { Tag, TagData, TagProps } from "./todoTask/tag"
import moment from "moment"
import { DeleteTodoTaskFromList, UpdateTodoTaskFromList } from "@/handlers/taskHandlers"
import { BackgroundlessInput } from "./utils/backgroundlessInput"
import { AddTag } from "./todoTask/addTag"

export enum PriorityEnum {
    None,
    Low,
    Medium,
    High,
    Extreme
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
            className={`p-[4px] border-b-[1px] flex items-center group/task ${completed && "bg-gray-200"}`}
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
                            <>
                                <div className="flex gap-x-[4px]">
                                    <p>Edit Text: </p>
                                    <BackgroundlessInput
                                        placeholder={"Task Title"}
                                        type="text"
                                        classNameCustom="truncate overflow-hidden whitespace-nowrap block"
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                    />
                                </div>

                                {dueDate ? 
                                    <div className="flex justify-start items-center gap-x-[4px]">
                                        <p>Select Date: </p>
                                        <input
                                            type="date"
                                            value={moment(dueDate).format("YYYY-MM-DD")}
                                            onChange={(e) => setDueDate(new Date(e.target.value))}
                                        />

                                        <button 
                                            className="rounded-full border-[1px] border-black px-[6px] py-[4px] hover:bg-gray-200"
                                            onClick={() => setDueDate(undefined)}
                                            >
                                            Remove Due Date
                                        </button>
                                    </div>
                                    :
                                    <button 
                                        className="rounded-full border-[1px] border-black px-[6px] py-[4px] hover:bg-gray-200"
                                        onClick={() => setDueDate(new Date(Date.now()))}
                                        >
                                        Schedule Due Date
                                    </button>
                                }

                                <div className="flex gap-x-[4px]">
                                    <p>Select Priority</p>
                                    <select
                                        value={PriorityEnum[priority ?? 0]}
                                        onChange={e => setPriority(PriorityEnum[e.target.value as keyof typeof PriorityEnum])}
                                        >
                                        {Object.keys(PriorityEnum).filter(key => isNaN(Number(key))).map(priorityOption => {
                                            return <option>{priorityOption}</option>
                                        })}
                                    </select>
                                </div>
                                
                            </>

                            

                            :
                            <h3 
                                className={`truncate overflow-hidden whitespace-nowrap block ${completed && "line-through"}`}
                            >
                                {originalTaskData.text}
                            </h3>

                        }
                    </div>


                </div>

                <ul className="space-x-[4px] space-y-[2px]">
                    {originalTaskData.priority != undefined && originalTaskData.priority > PriorityEnum.None && !editMode &&
                        <li key={-2} className="inline h-full">
                            <Tag
                                onDelete={() => {
                                    setPriority(undefined);
                                }}
                                editMode={editMode}

                            >
                                <p>{PriorityEnum[originalTaskData.priority ?? 0]} priority</p>
                            </Tag>
                        </li>

                    }

                    {originalTaskData.dueDate && !editMode &&
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

            {/* ${!editMode && "group-hover/task:visible invisible"} */}
            <div className={`flex justify-end items-center gap-x-[8px] flex-shrink-0 flex-grow`}>
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
}