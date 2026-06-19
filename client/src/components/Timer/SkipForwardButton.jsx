import { useState } from "react"
import "./Timer.css";
import { SkipForward } from "lucide-react";


export default function SkipForwardButton({onClick}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button 
            onClick={onClick}
            onMouseEnter={() =>setIsHovered(true)}
            onMouseLeave={() =>setIsHovered(false)}
            className="timer__btn timer__btn--skip"
        >
        <SkipForward 
            className="transition-colors duration-200"
            strokeWidth={1.5} 
            color="currentColor"
            fill={isHovered ? 'currentColor' : 'none'} 
        />            
        </button>
    )
}
