import Head from 'next/head'
import useSWR, { useSWRConfig } from 'swr'
import TodoForm from 'components/TodoForm';
import TodoDialog from 'components/TodoDialog';
import { useState, React } from 'react';
import { Container, Row, Col, ListGroup, Stack, Form, Button, Fade } from 'react-bootstrap';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const removeTodo = (e, todoId, mutate) => {
  e.stopPropagation()

  mutate('/api/todos', async todos => {
    await fetch('/api/todos?id=' + todoId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return todos.filter(todo => todo.id !== todoId)
  })
}

const updateTodo = (todo, mutate) => {
  todo.done = !todo.done;
  mutate('/api/todos', async todos => {
    let result = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })
    let updatedTodo = await result.json()
    let updatedIndex = todos.indexOf(todo)
    todos[updatedIndex] = updatedTodo;
    return todos
  })
}

const openDialog = (item, setIsOpen, setSelectedObj) => {
  setIsOpen(true)
  setSelectedObj(item)
}

const tableRowItem = (item, setIsOpen, setSelectedObj, mutate) => {
  return (
    <ListGroup.Item key={item.id} variant={item.done && "success"}>
      <Stack direction="horizontal" gap={2}>
        <div className="me-auto">
          <Form.Check
            checked={item.done}
            onChange={() => {
              updateTodo(item, mutate)
            }}
            type="switch" />
        </div>
        <div className="me-auto">{item.title}</div>
        <div><Button variant="danger" size="sm" onClick={(e) => removeTodo(e, item.id, mutate)}>X</Button></div>
      </Stack>
    </ListGroup.Item>
  )
}

export default function Home() {

  const { mutate } = useSWRConfig()
  const { data, error } = useSWR('/api/todos', fetcher)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedObj, setSelectedObj] = useState({})

  if (error) return <div>Failed to Load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Container>
        <Row>
          <Col><TodoForm /></Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {
                data.map((item) => tableRowItem(item, setIsOpen, setSelectedObj, mutate))
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
    /*
    <div className='content'>
      <Head>
        <title>To-Do</title>
        <meta name="description" content="To-Do NextJS" />
      </Head>

      <div className='container'>
        <TodoForm />

        <div className='list'>
          {
            data.map((item) => tableRowItem(item, setIsOpen, setSelectedObj, mutate))
          }
        </div>
      </div>

      <TodoDialog title="Editar tarefa" isOpen={isOpen} setIsOpen={setIsOpen} item={selectedObj} />

    </div>
    */
  )
}