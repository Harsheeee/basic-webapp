import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Checkbox
} from '@mantine/core';
import '@mantine/core/styles.layer.css';
import axios from 'axios';

interface TodoType {
  id: string;
  username: string;
  title: string;
  description: string;
  done: boolean;
  deadline: string;
}

interface Props {
  todo: TodoType;
  onEdited: () => void;
}

const EditTodo: React.FC<Props> = ({ todo, onEdited }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      done: false,
      deadline: '',
    },
  });

  const handleOpen = () => {
    form.setValues({
      title: todo.title,
      description: todo.description,
      done: todo.done,
      deadline: todo.deadline,
    });
    open();
  };

  const handleEdit = async (values: typeof form.values) => {
    try {
      await axios.put(`http://localhost:8000/update?id=${todo.id}`, {
        username: todo.username,
        ...values,
      });
      close();
      onEdited();
    } catch (error) {
      alert("Couldn't edit todo");
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Todo"
        centered
        size="lg"
        zIndex={9999}
        styles={{
          content: {
            maxWidth: '450px',
            width: '50%',
          },
          title:{
            color:'black',
            textAlign: 'center',
            width: '100%'
          }
        }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <form onSubmit={form.onSubmit(handleEdit)}>
          <TextInput
            required
            label="Title"
            placeholder="Enter new title"
            {...form.getInputProps('title')}
          />
          <Textarea
            required
            label="Description"
            placeholder="Enter new description"
            mt="md"
            {...form.getInputProps('description')}
          />
          <Checkbox
            label="Completed"
            mt="md"
            {...form.getInputProps('done', { type: 'checkbox' })}
          />
          <TextInput
            required
            label="Deadline"
            placeholder="Enter deadline"
            mt="md"
            {...form.getInputProps('deadline')}
          />
          <Button type="submit" fullWidth mt="lg">
            Save Changes
          </Button>
        </form>
      </Modal>

      <Button
        color='#f59e0b'
        size='md'
        radius='md'
        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
        onClick={handleOpen}
      >
        Edit
      </Button>
    </>
  );
};

export default EditTodo;
