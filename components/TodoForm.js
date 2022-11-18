import { useState } from 'react';

const postNewTodo = function (todo) {
    fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    })
}

const checkKeyPressed = function (event, callbackFunc) {
    if (event.defaultPrevented) return;
    let key = event.key || event.keyCode;
    if (key === 'Enter' || key === 13) callbackFunc();
}

export default function TodoForm() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    return (
        <div className='todo-form input-group'>
            <input className='title-input'
                type="text"
                placeholder="O que você precisa fazer?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyUp={(e) => checkKeyPressed(e, () => {
                    postNewTodo({ title, description })
                    setTitle("")
                })} />
            <button onClick={() => {
                postNewTodo({ title, description })
                setTitle("")
            }} className='add-button'>
                <svg width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
            </button>
        </div>
    )
}