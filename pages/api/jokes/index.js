import dbConnect from '../../../db/connect';
import Joke from '../../../db/models/Joke';

export default async function handler(request, response) {
  try {
    await dbConnect();
  } catch (error) {
    return response.status(500).json({ error: 'Database connection error: ' + error.message });
  }

  if (request.method === 'GET') {
    try {
      const jokes = await Joke.find();
      // return is optional here but improves readability and ensures function termination
      return response.status(200).json(jokes);
    } catch (error) {
      // return is optional here but improves readability and ensures function termination
      return response.status(500).json({ error: 'Error retrieving jokes: ' + error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const jokeData = request.body;
      await Joke.create(jokeData);

      // return is optional here but improves readability and ensures function termination
      return response.status(201).json({ status: 'Joke created' });
    } catch (error) {
      // return is optional here but improves readability and ensures function termination
      return response.status(400).json({ error: 'Error creating joke: ' + error.message });
    }
  }

  // Handle other HTTP methods
  response.setHeader('Allow', ['GET', 'POST']);
  // return is optional here but improves readability and ensures function termination
  return response.status(405).json({ error: `Method ${request.method} not allowed` });
}
