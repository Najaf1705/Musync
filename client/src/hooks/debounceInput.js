import { useEffect, useState } from "react"

const useDebounce=(value,delay=500)=>{
    const [debouncedVal,setDebouncedVal]=useState(value);

    useEffect(()=>{
        const timeout=setTimeout(()=>{
            setDebouncedVal(value);
            console.log("debounced val:",value);
        },delay);

        return () => clearTimeout(timeout);
    },[value,delay]);

    return debouncedVal;
}

export default useDebounce;