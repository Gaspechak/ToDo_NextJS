import Head from 'next/head'
import useSWR from 'swr'
import TodoForm from 'components/TodoForm';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const removeTodo = (todoId) => {
  fetch('/api/todos?id=' + todoId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const updateTodo = (todo) => {
  todo.done = !todo.done;
  console.log(todo)

  fetch('/api/todos', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
}

const tableRowItem = (item) => {
  return (
    <div key={item.id} className={`list-item ${item.done ? 'done' : ''}`}>
      <input type="checkbox" checked={item.done} onChange={() => updateTodo(item)} />
      <div>{item.title}</div>

      <svg className="w-5 h-5 remove-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" onClick={() => removeTodo(item.id)}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export default function Home() {

  const { data, error } = useSWR('/api/todos', fetcher, { refreshInterval: 10 })

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
          {data.map((item) => tableRowItem(item))}
        </div>
      </div>

    </div>
  )
}