import Head from 'next/head'
import useSWR from 'swr'
import TodoForm from 'components/TodoForm';
import TodoDialog from 'components/TodoDialog';
import { useState, React } from 'react';


const fetcher = (...args) => fetch(...args).then((res) => res.json())

const removeTodo = (e, todoId) => {
  e.stopPropagation()
  fetch('/api/todos?id=' + todoId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const updateTodo = (todo) => {
  fetch('/api/todos', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
}

const itemChecked = (e, item) => {
  e.stopPropagation()
  item.done = !item.done;
  updateTodo(item);
}

const openDialog = (item, setIsOpen, setSelectedObj) => {
  setIsOpen(true)
  setSelectedObj(item)
}

const tableRowItem = (item, setIsOpen, setSelectedObj) => {
  return (
    <div key={item.id} className={`list-item ${item.done ? 'done' : ''}`} onClick={() => openDialog(item, setIsOpen, setSelectedObj)}>
      <input type="checkbox" checked={item.done} onClick={(e) => itemChecked(e, item)} onChange={() => { }} />

      <div>{item.title}</div>

      <svg className="remove-button" onClick={(e) => removeTodo(e, item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
      </svg>

    </div>
  )
}

export default function Home() {

  const { data, error } = useSWR('/api/todos', fetcher, { refreshInterval: 10 })

  const [isOpen, setIsOpen] = useState(false)
  const [selectedObj, setSelectedObj] = useState({})

  if (error) return <div>Failed to Load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className='content'>
      <Head>
        <title>To-Do</title>
        <meta name="description" content="To-Do NextJS" />
      </Head>

      <div className='container'>
        <TodoForm />

        <div className='list'>
          {data.map((item) => tableRowItem(item, setIsOpen, setSelectedObj))}
        </div>
      </div>

      <TodoDialog title="Editar tarefa" isOpen={isOpen} setIsOpen={setIsOpen} item={selectedObj} />

    </div>
  )
}