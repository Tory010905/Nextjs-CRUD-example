export interface TagData {
    children? : React.ReactElement[] | React.ReactNode
    iconPath? : string,
    color? : string,
    onDelete : () => void
}


export interface TagProps extends TagData {
    editMode : boolean,
}



export const Tag = (props : TagProps) => {

    return (
        <div className={`
            text-[12px] rounded-full
            px-[8px]
            py-[6px]
            border-black
            border-[1px]
            inline-block
            `}>
                <div className="flex justify-start items-center gap-x-[2px]">
                    {props.iconPath &&
                        <img
                            src={props.iconPath}
                            alt="icon"
                            className="w-[10px] h-[10px] inline"
                        />
                    }

                    {props.children ?? <></>}

                    {props.editMode &&
                        <img
                            src={"cross.svg"}
                            alt="delete-tag-button"
                            className="w-[12px] h-[12px] inline cursor-pointer"
                            onClick={() => props.onDelete()}
                        />
                    }
                </div>
        </div>
    )
}