"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import ClipLoader from 'react-spinners/ClipLoader';

export default function FormPage() {
  const [userInput, setUserInput] = useState('');
  const router = useRouter()

  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    fetch('/api/condition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userQuery: userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setAiResponse(data.aiResponse);
        setLoading(false);
      })
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      {!aiResponse ? (
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <header className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
              Describe Your Condition
            </h1>
            <p className="text-lg lg:text-xl text-gray-700">
              Please explain what you are experiencing in detail (include the part of the body and type of pain if possible)
            </p>
          </header>
          <form onSubmit={handleSubmit}>
            <textarea
              value={userInput}
              onChange={handleUserInput}
              placeholder="Describe your condition in detail..."
              className="w-full h-40 rounded-lg py-2 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg py-3 px-6 mt-4 ml-2 transition duration-300 ease-in-out hover:bg-blue-600"
            >
              Submit
            </button>
            {loading && <ClipLoader color={'#123abc'} loading={loading} />}
          </form>
        </div>
      ) : (
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <header className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
              AI Response
            </h1>
            <ReactMarkdown className="text-lg lg:text-xl text-gray-700">
              {aiResponse}
            </ReactMarkdown>
          </header>
          <button
            onClick={() => setAiResponse('')}
            className="bg-blue-500 text-white rounded-lg py-3 px-6 mt-4 ml-2 transition duration-300 ease-in-out hover:bg-blue-600">
            Go Back
          </button>
          <button
            onClick={() => router.push('/tracker')}
            className="bg-blue-500 text-white rounded-lg py-3 px-6 mt-4 ml-2 transition duration-300 ease-in-out hover:bg-blue-600">
            Go to tracking
          </button>
        </div>
      )}
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; 2023 Suna. All rights reserved.
      </footer>
    </main>
  );
}
