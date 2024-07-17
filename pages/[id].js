import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import JokeForm from '@/components/JokeForm';
import Link from 'next/link';

export default function JokeDetailPage() {
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/jokes/${id}`);

  async function handleEdit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jokeData = Object.fromEntries(formData);

    try {
      const response = await fetch(`/api/jokes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jokeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update the joke.');
      }

      mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error updating joke: ' + error.message);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/jokes/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete the joke.');
      }

      router.push('/');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error deleting joke: ' + error.message);
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) return;

  return (
    <>
      <small>ID: {id}</small>
      <h1>{data.joke} </h1>
      <div>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}>
          <span role="img" aria-label="A pencil">
            ✏️
          </span>
        </button>
        <button onClick={handleDelete} disabled={isEditMode}>
          <span role="img" aria-label="A cross indicating deletion">
            ❌
          </span>
        </button>
      </div>
      {isEditMode && <JokeForm onSubmit={handleEdit} value={data.joke} isEditMode={true} />}
      <Link href="/">Back to all</Link>
    </>
  );
}
