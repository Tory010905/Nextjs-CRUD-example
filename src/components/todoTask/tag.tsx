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
            md:text-[12px] rounded-lg
            md:px-[8px]
            md:py-[6px]
            text-[10px]
            px-[4px]
            py-[3px]
            border-black
            border-[1px]
            inline-block
            `}>
                <div className="flex justify-start items-center gap-x-[2px]">
                    {props.iconPath &&
                        <img
                            src={props.iconPath}
                            alt="icon"
                            className="md:w-[10px] md:h-[10px] w-[8px] h-[8px]"
                        />
                    }

                    {props.children ?? <></>}

                    {props.editMode &&
                        <img
                            src={"cross.svg"}
                            alt="delete-tag-button"
                            className="md:w-[12px] md:h-[12px] w-[8px] h-[8px] cursor-pointer"
                            onClick={() => props.onDelete()}
                        />
                    }
                </div>
        </div>
    )
}