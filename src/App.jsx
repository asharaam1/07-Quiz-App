import React, { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 sec per question

  const input = useRef([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    async function allQuizes() {
      try {
        const response = await fetch('https://the-trivia-api.com/v2/questions/');
        const data = await response.json();
        console.log(data);
        setQuestions(data)
      } catch (err) {
        console.log('Error:', err);
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    allQuizes();
  }, []);

  useEffect(() => {
    if (questions) {
      const options = [
        ...questions[index].incorrectAnswers,
        questions[index].correctAnswer,
      ];
      setShuffledOptions(shuffleArray(options));
      input.current = [];
      setTimeLeft(60); // reset timer for each question
    }
  }, [index, questions]);

  // Timer logic
  useEffect(() => {
    if (isFinished || loading || error) return;

    if (timeLeft === 0) {
      nextQuestion(true); // auto move on timeout
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isFinished, loading, error]);


  function shuffleArray(arr) {
    const emptyArr = []
    const shuffleArr = []
    for (let i = 0; i < arr.length; i++) {
      const randomNumber = Math.floor(Math.random() * arr.length)
      if (emptyArr.includes(randomNumber)) {
        // console.log("number already mujood ha");
        i--
      } else {
        emptyArr.push(randomNumber)
        // console.log(randomNumber);
        shuffleArr[randomNumber] = arr[i]
      }

    }
    return shuffleArr

  }


  function nextQuestion(autoNext = false) {
    if (!autoNext) {
      const selectedOption = input.current.find(item => item && item.checked);
      if (!selectedOption) {
        alert("Please select an option.");
        return;
      }

      if (questions[index].correctAnswer === selectedOption.value) {
        setResult((prev) => prev + 10);
      }
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setIsFinished(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Quiz App</h1>

        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-800">
            Score: <span className="text-green-600">{result}</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Time Left:</span>
            <span className="text-md font-semibold text-red-600">{timeLeft}s</span>
          </div>
        </div>

        {loading && <h3 className="text-blue-500 text-center">Loading...</h3>}
        {error && <h3 className="text-red-600 text-center">Error occurred while fetching questions.</h3>}

        {!loading && !error && questions && !isFinished && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Q{index + 1}. {questions[index].question.text}
            </h2>

            <div className="space-y-3">
              {shuffledOptions.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="question"
                    value={item}
                    id={`option${i}`}
                    ref={el => input.current[i] = el}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <label htmlFor={`option${i}`} className="text-gray-700 cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>

            <div className="pt-4 text-right">
              <button
                onClick={() => nextQuestion(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
              >
                {index === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-700">🎉 Quiz Completed!</h2>
            <p className="text-lg text-gray-800">
              Your Final Score is <span className="font-semibold text-green-600">{result}</span> out of {questions.length * 10}
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-lg transition"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;