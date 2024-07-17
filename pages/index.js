import useSWR from 'swr';
import Link from 'next/link';
import JokeForm from '../components/JokeForm';

export default function HomePage() {
  const { data, error, mutate } = useSWR('/api/jokes');

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  if (!data) {
    return <h1>Loading...</h1>;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jokeData = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/jokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jokeData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the joke.');
      }

      mutate();
    } catch (error) {
      console.error(error);
      alert('Error submitting joke: ' + error.message);
    }
  }

  return (
    <>
      <JokeForm onSubmit={handleSubmit} value="" />
      <ul>
        {data.map((joke) => (
          <li key={joke._id}>
            <Link href={`/${joke._id}`}>{joke.joke}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
