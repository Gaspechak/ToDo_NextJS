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
        <div className='todo-form'>
            <input className='title-input'
                type="text"
                placeholder="O que você precisa fazer?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyUp={(e) => checkKeyPressed(e, () => {
                    postNewTodo({ title, description })
                    setTitle("")
                })} />
        </div>
    )
}