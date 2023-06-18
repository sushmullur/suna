"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function FormPage() {
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission or API call with user input
    console.log(userInput);
    // Redirect to the "/exercises" endpoint
    window.location.href = '/exercises';
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-b from-blue-100 to-blue-200">
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
        </form>
      </div>
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; 2023 Suna. All rights reserved.
      </footer>
    </main>
  );
}
