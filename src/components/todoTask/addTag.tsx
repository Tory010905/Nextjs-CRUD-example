"use client"
import { useState, FocusEvent, useRef, useDebugValue, useEffect } from "react"
import { BackgroundlessInput } from "../utils/backgroundlessInput"
import { Tag, TagProps } from "./tag"

interface AddTagProps {
    onEditEnd: (tagText: string) => void
}

export const AddTag = (props: AddTagProps) => {
    const [focus, setFocus] = useState(false);
    const [tagText, setTagText] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditMode(focus && tagText.length > 0);
    }, [focus, tagText])


    const handleConfirm = () => {

        setFocus(false);

        props.onEditEnd(tagText);

        setTagText("");
    }

    const handleDelete = () => {
        setFocus(false);
        setTagText("");
    }

    return (
        <Tag
            editMode={editMode}
            onDelete={() => handleDelete()}
            >
            <>
                <BackgroundlessInput
                    placeholder={"Click To Add New Tag"}
                    value={tagText}
                    onChange={(e) => setTagText(e.target.value)}
                    onFocus={() => setFocus(true)}
                >
                </BackgroundlessInput>

                {editMode &&
                    <img
                        src="confirm.svg"
                        alt="confirm-btn"
                        className="w-[12px] h-[12px] inline cursor-pointer"
                        onClick={() => handleConfirm()}
                    />
                }
                
            </>

        </Tag>
    )
}