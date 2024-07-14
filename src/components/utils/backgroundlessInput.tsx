"use client"
import React, { useRef } from 'react';

interface BackgroundlessInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    classNameCustom? : string
}

export const BackgroundlessInput = (props : BackgroundlessInputProps) => {
    const ref = useRef<HTMLInputElement>(null);

    

    return (
        <input
            ref={ref}
            onKeyDown={(e) => {
                if(e.key === "Enter" || e.key === "Escape"){
                    ref.current?.blur();
                }
            }}
            className={`${props.classNameCustom ?? ""} :text-gray-400 hover:text-black focus:text-black bg-gray-100 border-0`}
            {...props}
        />
    )
}