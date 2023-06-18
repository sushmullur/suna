import Link from 'next/link';

export default function ExercisesPage() {
  const workoutData = [
    {
      title: 'Exercise 1',
      description: 'This will contain details about exercise 1, suggested by the LLM.',
    },
    {
      title: 'Exercise 2',
      description: 'This will contain details about exercise 2, suggested by the LLM.',
    },
    {
      title: 'Exercise 3',
      description: 'This will contain details about exercise 3, suggested by the LLM.',
    },
    // Add more workout data as needed
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Suggested Exercises
          </h1>
          <p className="text-lg lg:text-xl text-gray-700">
            Here are some exercises recommended for your condition:
          </p>
        </header>
        <div className="space-y-8">
          {workoutData.map((workout, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                {workout.title}
              </h2>
              <p className="text-lg text-gray-700">{workout.description}</p>
            </div>
          ))}
        </div>
        <Link href="/tracker">
          <button className="mt-8 bg-blue-500 text-white rounded-lg py-3 px-6 font-semibold transition duration-300 ease-in-out hover:bg-blue-600">
            I'm Ready!
          </button>
        </Link>
      </div>
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; 2023 Suna. All rights reserved.
      </footer>
    </main>
  );
}
