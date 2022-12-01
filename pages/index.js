import Head from 'next/head'
import useSWR, { useSWRConfig } from 'swr'
import TodoForm from 'components/TodoForm';
import TodoDialog from 'components/TodoDialog';
import { useState, React } from 'react';
import { Container, Row, Col, ListGroup, Stack, Form, Button, Modal } from 'react-bootstrap';

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

const tableRowItem = (item, handleItemClick, mutate) => {
  return (
    <ListGroup.Item key={item.id} variant={item.done && "success"} onClick={() => handleItemClick(item)}>
      <Stack direction="horizontal" gap={2}>
        <div className="me-auto">
          <Form.Check
            checked={item.done}
            onClick={(e) => {
              e.stopPropagation();
              item.done = !item.done;
              updateTodo(item, mutate)
            }}
            onChange={() => {}}
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

  const [show, setShow] = useState(false);

  const [inputTitle, setInputTitle] = useState("")
  const [inputDescription, setInputDescription] = useState("")
  const [selectedObj, setSelectedObj] = useState({})

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (error) return <div>Failed to Load</div>
  if (!data) return <div>Loading...</div>

  const handleItemClick = (item) => {
    setSelectedObj(item)
    handleShow()
    setInputDescription(item.description)
    setInputTitle(item.title)
  }

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
                data.map((item) => tableRowItem(item, handleItemClick, mutate))
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar tarefa</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título da Tarefa</Form.Label>
              <Form.Control type="text" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição da tarefa</Form.Label>
              <Form.Control as="textarea" rows={4} value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={() => {
            selectedObj.title = inputTitle
            selectedObj.description = inputDescription
            updateTodo(selectedObj, mutate)
            setInputDescription("")
            setInputTitle("")
            setSelectedObj({})
            handleClose()
          }}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}