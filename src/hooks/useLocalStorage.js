import { useEffect,useState } from "react";

const useLocalStorage = (key,initialValue) => {
    const [value,setValue] = useState(()=>{
        try {
            const localValue = localStorage.getItem(key);
            return localValue?JSON.parse(localValue) : initialValue;
        }
        catch(error){
            return initialValue;
        }
    })

    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(value))
    },[key,value])

    return [value, setValue];
};

export default useLocalStorage;