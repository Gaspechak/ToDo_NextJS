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

export default function TodoForm() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    return (
        <div>
            <input type="text" placeholder="Titulo" value={title} onChange={e => setTitle(e.target.value)} />
            <br />
            <input type="text" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
            <br />
            <button onClick={() => postNewTodo({ title, description })}>Enviar</button>
        </div>
    )
}