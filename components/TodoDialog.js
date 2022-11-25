import { useState } from 'react';

const updateTodo = (title, description, todo) => {
    todo.title = title
    todo.description = description

    fetch('/api/todos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
}

export default function TodoDialog(props) {

    const [title, setTitle] = useState(props.item.title)
    const [description, setDescription] = useState(props.item.description)

    if (props.isOpen === true) {

        return (
            <div className='todo-dialog'>
                <div className='todo-dialog-toolbar'>
                    <div>{props.title}</div>
                    <div onClick={() => props.setIsOpen(false)} className='close'>X</div>
                </div>
                <div className="todo-dialog-body">
                    <input className='title-input' type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
                    <textarea className='description-input' type="text" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
                    <div className="action-buttons">
                        <button onClick={() => {
                            updateTodo(title, description, props.item)
                            props.setIsOpen(false)
                        }}>Salvar</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}