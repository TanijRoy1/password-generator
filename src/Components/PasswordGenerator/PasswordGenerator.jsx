import React, { useCallback, useEffect, useRef, useState } from 'react';

const PasswordGenerator = () => {
    const [length, setLength] = useState(6);
    const [numberAllowed, setNumberAllowed] = useState(false);
    const [charAllowed, setCharAllowed] = useState(false);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const passwordGenerator = useCallback (() => {
        let pass = "";
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        if(numberAllowed) str += "0123456789";
        if(charAllowed) str += "@#$%&(){}[]";
        // console.log(str);
        for(let i=1; i<= length; i++){
            const charIndex = Math.floor(Math.random()*str.length);
            pass += str.charAt(charIndex);
        }
        // console.log(pass);
        setPassword(pass);
    }, [length, numberAllowed, charAllowed, setPassword])

    useEffect(()=>{
        passwordGenerator();
        setCopied(false);
    },[numberAllowed, charAllowed, length, passwordGenerator])

    const passwordRef = useRef(null);
    const copyPassToClipbaord = useCallback(() => {
        passwordRef.current?.select();
        // passwordRef.current?.setSelectionRange(0, 5)
        window.navigator.clipboard.writeText(password);
        setCopied(true);
    }, [password])
    return (
        <div className='bg-green-100 max-w-md mx-auto p-5 my-5 rounded shadow-md'>
            <h1 className='text-2xl font-bold text-green-500 text-center mb-3'>Password Generator</h1>
            <div className='flex justify-between h-10 rounded border border-green-500'>
                <input type="text" 
                 value={password} ref={passwordRef} readOnly //input password
                 placeholder='Password' className='bg-white flex-1 rounded-l px-2 outline-none' />
                <button onClick={copyPassToClipbaord} 
                 className='bg-green-400 px-5 py-1 rounded-r font-semibold text-white cursor-pointer'>{copied?"Copied":"Copy"}</button>
            </div>
            <div className="flex gap-3 font-medium mt-3">
                <div className="flex gap-1">
                    <input type="range"
                     min={6} max={12} value={length} onChange={(e) => setLength(e.target.value)} //input range
                     className='cursor-pointer' />
                    <label htmlFor="">Length: {length}</label>
                </div>
                <div className="flex gap-1">
                    <input type="checkbox"
                     defaultChecked={numberAllowed} onChange={() => setNumberAllowed(prev => !prev)} //input Number
                     id='NumberInput'
                     className='cursor-pointer' />
                    <label htmlFor="NumberInput">Number</label>
                </div>
                <div className="flex gap-1">
                    <input type="checkbox"
                     defaultChecked={charAllowed} onChange={() => setCharAllowed(prev => !prev)} //input Character
                     id="characterInput"
                     className='cursor-pointer' />
                    <label htmlFor="characterInput">Character</label>
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;