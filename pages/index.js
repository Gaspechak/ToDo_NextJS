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

const tableRowItem = (item) => {
  return (
    <div key={item.id} className="list-item">
      <input type="checkbox" />
      <div>{item.title}</div>
      <button onClick={() => removeTodo(item.id)}>X</button>
    </div>
  )
}

export default function Home() {

  const { data, error } = useSWR('/api/todos', fetcher, { refreshInterval: 10 })

  if (error) return <div>Failed to Load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Head>
        <title>To-Do</title>
        <meta name="description" content="To-Do NextJS" />
      </Head>

      <TodoForm />

      <div className='list'>
        {data.map((item) => tableRowItem(item))}
      </div>

    </div>
  )
}