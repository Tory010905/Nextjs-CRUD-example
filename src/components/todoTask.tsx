"use client"
import { useEffect, useState } from "react"
import { Tag } from "./todoTask/tag"
import moment from "moment"
import { UpdateTodoTaskFromList } from "@/handlers/taskHandlers"
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

export interface TodoTaskProps extends TodoTaskData {
    onDelete: () => void
    editMode?: boolean
}

export const TodoTask = (props: TodoTaskProps) => {

    const [originalTaskData, setOriginalTaskData] = useState<TodoTaskData>(props);
    const [text, setText] = useState(props.text);
    const [editMode, setEditMode] = useState(props.editMode ?? false);
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

    useEffect(() => {
        handleTaskUpdate();
    }, [completed])

    const handleDelete = () => {
        props.onDelete();
    }

    return (
        <div
            className={`p-[10px] border-b-[1px] w-full flex items-center group/task ${completed && "bg-gray-200 border-gray-300"} hover:bg-gray-300`}
        >
            <div className="flex flex-grow-0 pr-[10px] w-[20px] cursor-pointer" onClick={() => setCompleted(!completed)}>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    disabled={editMode}
                />
            </div>

            <div className="flex-1 overflow-auto">
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <div className="overflow-hidden md:text-base text-[10px]">
                            {editMode ?
                                <div className="flex flex-col justify-center items-start gap-y-[8px] pb-[8px]">
                                    <div className="flex gap-x-[4px]">
                                        <p>Edit Text: </p>
                                        <BackgroundlessInput
                                            placeholder={"Task Title"}
                                            type="text"
                                            value={text}
                                            onChange={e => setText(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-start items-center gap-x-[4px]">
                                        <p>Select Date: </p>
                                        <input
                                            type="date"
                                            value={dueDate ? moment(dueDate).format("YYYY-MM-DD") : ""}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    setDueDate(new Date(e.target.value))
                                                }
                                                else {
                                                    setDueDate(undefined);
                                                }

                                            }}

                                        />
                                    </div>


                                    <div className="flex gap-x-[4px]">
                                        <p>Select Priority</p>
                                        <select
                                            value={PriorityEnum[priority ?? 0]}
                                            onChange={e => setPriority(PriorityEnum[e.target.value as keyof typeof PriorityEnum])}
                                        >
                                            {Object.keys(PriorityEnum).filter(key => isNaN(Number(key))).map((priorityOption, key) => {
                                                return <option key={key}>{priorityOption}</option>
                                            })}
                                        </select>
                                    </div>

                                </div>



                                :
                                <h3
                                    className={` block text-lg ${completed && "line-through"}`}
                                >
                                    {originalTaskData.text}
                                </h3>

                            }
                        </div>


                    </div>

                    <ul className="space-x-[6px] space-y-[4px]">
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
            </div>

            <div className={`flex justify-end items-center md:w-[100px] w-[80px] gap-x-[8px] flex-shrink-0 
                ${!editMode && "md:group-hover/task:visible md:group-hover/task:pointer-events-auto md:pointer-events-none md:invisible"}
                `}>
                {editMode ?
                    <>
                        <img
                            className="md:w-[24px] md:h-[24px] h-[20px] w-[20px] p-[4px] cursor-pointer"
                            src="undo.svg"
                            alt="undo-button"
                            onClick={() => handleUndoClick()}
                        />

                        <img
                            className="md:w-[24px] md:h-[24px] h-[20px] w-[20px] p-[4px] cursor-pointer"
                            src="confirm.svg"
                            alt="confirm-button"
                            onClick={() => handleConfirmEditClick()}
                        />
                    </>
                    :
                    <img
                        className={`md:w-[24px] md:h-[24px] h-[20px] w-[20px] p-[4px] cursor-pointer`}
                        src="edit.svg"
                        alt="edit-button"
                        onClick={() => setEditMode(true)}
                    />
                }


                <img
                    className={`md:w-[24px] md:h-[24px] h-[20px] w-[20px] p-[4px] cursor-pointer`}
                    src="trashcan.svg"
                    alt="delete-button"
                    onClick={() => handleDelete()}
                />
            </div>
        </div>
    )
}