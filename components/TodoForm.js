import { useState } from 'react';
import { useSWRConfig } from 'swr'
import { InputGroup, Form, Button } from 'react-bootstrap'

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

    const insertTodo = () => {
        postNewTodo({ title, description: '' }, mutate)
        setTitle("")
    }

    return (
        <>
            <div className='mt-4'>
                <InputGroup className='mb-3'>
                    <Form.Control
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onKeyUp={(e) => checkKeyPressed(e, () => insertTodo())}
                        placeholder="O que você precisa fazer?" />
                    <Button variant="success" onClick={() => insertTodo()}>Adicionar</Button>
                </InputGroup>
            </div>
        </>
    )
}