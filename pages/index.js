import Head from 'next/head'
import useSWR from 'swr'
import dayjs from 'dayjs';
import TodoForm from 'components/TodoForm';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function tableRowItem(item) {
  return (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</td>
      <td>{item.done ? 'Sim' : 'Não'}</td>
      <td>{item.finishedAt}</td>
    </tr>
  )
}

export default function Home() {

  const { data, error } = useSWR('/api/todos', fetcher, { refreshInterval: 1000 })

  if (error) return <div>Failed to Load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Head>
        <title>To-Do</title>
        <meta name="description" content="To-Do NextJS" />
      </Head>

      <TodoForm />

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Criado em</th>
            <th>Finalizado</th>
            <th>Finalizado em </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => tableRowItem(item))}
        </tbody>
      </table>
    </div>
  )
}