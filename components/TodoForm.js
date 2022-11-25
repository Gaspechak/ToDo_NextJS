import { useState } from 'react';
import { useSWRConfig } from 'swr'

const postNewTodo = function (todo, mutate) {
    mutate('/api/todos', async todos => {
        let result = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        })
        let insertedTodo = await result.json()
        let filteredData = todos.filter(todo => todo.id !== insertedTodo.id)
        return [...filteredData, insertedTodo]
    }, { revalidate: false })
}

const checkKeyPressed = function (event, callbackFunc) {
    if (event.defaultPrevented) return;
    let key = event.key || event.keyCode;
    if (key === 'Enter' || key === 13) callbackFunc();
}

export default function TodoForm(props) {

    const { mutate } = useSWRConfig()

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
                    postNewTodo({ title, description }, mutate)
                    setTitle("")
                })} />


            <button className='add-button' onClick={() => {
                postNewTodo({ title, description }, mutate)
                setTitle("")
            }}>

                <svg width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>

            </button>

        </div>
    )
}