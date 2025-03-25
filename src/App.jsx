import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function allQuizes() {
      try {
        const response = await fetch('https://the-trivia-api.com/v2/questions/');
        const data = await response.json();
        console.log(data);
        setQuestion(data)
      } catch (err) {
        console.log('Error:', err);
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    allQuizes();
  }, []);


  return (
    <>
      {question && <h1>Q:1 {question[0].question.text}</h1>}

      {error && <h1>error occured</h1>}
      {loading && <h1>loading...</h1>}

    </>
  )
}

export default App