import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    async function allQuizes() {
      try {
        const response = await fetch('https://the-trivia-api.com/v2/questions/');
        const data = await response.json();
        console.log(data);
        setQuestion(data)
      } catch (err) {
        console.log('Error:', err);
        setError(err)
      }
    }
    allQuizes();
  }, []);


  return (
    <>{question &&
      <h1>Q:1 {question[0].question.text}</h1>

    }
    </>
  )
}

export default App