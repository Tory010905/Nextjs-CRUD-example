"use client"

interface AddNewListBtnProps {
    onClick? : () => void
}

export const AddNewListBtn = (props : AddNewListBtnProps) => {
    return (
        <div 
            className="p-2 bg-red-500 hover:bg-red-600 rounded-full cursor-pointer" 
            onClick={props.onClick}
            >
            <img 
                src="plus.png" 
                className={`
                    w-[24px] h-[24px]
                `}
            />
        </div>
    
    )
}