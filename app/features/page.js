import Link from 'next/link';

export default function WhatDoesItDoPage() {
  const features = [
    {
      title: 'AI-Powered Exercise Analysis',
      description:
        'Suna utilizes advanced AI algorithms to analyze exercises performed by patients, providing real-time insights and feedback to physical therapists.',
    },
    {
      title: 'Range of Motion Tracking',
      description:
        'The app leverages computer vision technology to accurately track and measure patients\' range of motion, enabling therapists to monitor progress and tailor treatment plans accordingly.',
    },
    {
      title: 'Intuitive Reporting',
      description:
        'Suna generates comprehensive reports based on patients\' range of motion data, allowing therapists to gain deeper insights into their recovery progress and make data-driven decisions.',
    },
    // Add more features as needed
  ];

  const faqs = [
    {
      question: 'How does Suna analyze exercises?',
      answer:
        'Suna uses AI algorithms trained on vast amounts of exercise data to recognize and evaluate the movements performed by patients. The algorithms compare the movements to established standards and provide insights on form, technique, and progress.',
    },
    {
      question: 'Can Suna be used for remote patient monitoring?',
      answer:
        'Absolutely! Suna supports remote patient monitoring, allowing physical therapists to monitor their patients\' exercises and progress from anywhere. The app enables seamless communication and collaboration between therapists and patients.',
    },
    // Add more FAQs as needed
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Does It Do?
          </h1>
          <p className="text-lg lg:text-xl text-gray-700">
            Discover the key features of Suna and find answers to common questions.
          </p>
        </header>
        <section className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Features
          </h2>
          <ul className="space-y-6">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex flex-col lg:flex-row items-start lg:items-center"
              >
                <div className="flex-shrink-0 bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <svg
                    className="text-white w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-700">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <ul className="space-y-6">
            {faqs.map((faq, index) => (
              <li
                key={index}
                className="border-t pt-6 border-gray-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-lg text-gray-700">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Reach out to our support team for any further inquiries or assistance.
          </p>
          <Link href="/contact">
            <p className="text-lg bg-blue-500 text-white rounded-lg px-6 py-3 font-semibold transition duration-300 ease-in-out hover:bg-blue-600">
              Contact Us
            </p>
          </Link>
        </section>
      </div>
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; 2023 Suna. All rights reserved.
      </footer>
    </main>
  );
}
