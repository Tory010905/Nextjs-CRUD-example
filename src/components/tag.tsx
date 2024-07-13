export interface TagProps {
    text : string,
    iconPath? : string,
    color? : string
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
                    <p>
                        {props.text}
                    </p>
                </div>
            
        </div>
    )
}