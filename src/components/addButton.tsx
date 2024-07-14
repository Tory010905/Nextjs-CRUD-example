"use client"

interface AddButtonProps {
    onClick? : () => void
    text : string
}

export const AddButton = (props : AddButtonProps) => {
    return (
        <div 
            className="p-2 bg-gray-100 hover:bg-gray-200 border-gray-200 border-[1px] rounded-full cursor-pointer flex justify-start items-center gap-x-[8px]" 
            onClick={props.onClick}
            >
            <img 
                src="plus.png" 
                className={`
                    w-[20px] h-[20px]
                `}
            />
            <p className="">
                {props.text}
            </p>
        </div>
    
    )
}