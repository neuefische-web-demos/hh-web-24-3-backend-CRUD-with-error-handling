import dbConnect from '../../../db/connect';
import Joke from '../../../db/models/Joke';

export default async function handler(request, response) {
  try {
    await dbConnect();
  } catch (error) {
    return response.status(500).json({ error: 'Database connection error: ' + error.message });
  }

  const { id } = request.query;

  if (request.method === 'GET') {
    try {
      const joke = await Joke.findById(id);

      if (!joke) {
        return response.status(404).json({ status: 'Not Found' });
      }

      // return is optional here but improves readability and ensures function termination
      return response.status(200).json(joke);
    } catch (error) {
      // return is optional here but improves readability and ensures function termination
      return response.status(500).json({ error: 'Error retrieving joke: ' + error.message });
    }
  }

  if (request.method === 'PUT') {
    try {
      const jokeData = request.body;
      await Joke.findByIdAndUpdate(id, jokeData, {
        new: true,
        runValidators: true,
        context: 'query',
      });

      // return is optional here but improves readability and ensures function termination
      return response.status(200).json({ message: 'Success!' });
    } catch (error) {
      // return is optional here but improves readability and ensures function termination
      return response.status(400).json({ error: 'Error updating joke: ' + error.message });
    }
  }

  if (request.method === 'DELETE') {
    try {
      await Joke.findByIdAndDelete(id);

      // return is optional here but improves readability and ensures function termination
      return response.status(200).json({ message: 'Success!' });
    } catch (error) {
      // return is optional here but improves readability and ensures function termination
      return response.status(400).json({ error: 'Error deleting joke: ' + error.message });
    }
  }

  // Handle other HTTP methods
  response.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  // return is optional here but improves readability and ensures function termination
  return response.status(405).json({ error: `Method ${request.method} not allowed` });
}
