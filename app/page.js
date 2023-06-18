import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="max-w-5xl w-full flex flex-col items-center bg-white rounded-lg shadow-lg p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome to Suna
          </h1>
          <p className="text-lg lg:text-xl text-gray-700">
            The Ultimate Tool for Physical Therapists
          </p>
        </header>
        <section className="flex flex-col lg:flex-row items-center justify-between mb-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transform Patient Recovery
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Suna provides cutting-edge technology to physical therapists,
              empowering them to measure and track their patients' range of
              motion accurately. Say goodbye to manual measurements and hello to
              precision and efficiency.
            </p>
            <Link href="/sendcondition">
              <p className="text-lg bg-blue-500 text-white rounded-lg px-6 py-3 font-semibold transition duration-300 ease-in-out hover:bg-blue-600">
                Get Started
              </p>
            </Link>
          </div>
          <div className="w-full lg:w-full lg:ml-12 mb-8 lg:mb-0">
            <Image
              src="/image1.png"
              alt="Easy-to-Use Interface"
              width={400}
              height={200}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </section>
        <section className="flex flex-col lg:flex-row items-center justify-between mb-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
              Easy-to-Use Interface
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Suna's intuitive interface allows physical therapists to record
              and monitor range of motion data effortlessly. Spend less time on
              paperwork and more time providing personalized care to your
              patients.
            </p>
            <Link href="/features">
              <p className="text-lg bg-blue-500 text-white rounded-lg px-6 py-3 font-semibold transition duration-300 ease-in-out hover:bg-blue-600">
                What Does It Do?
              </p>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 lg:ml-12 mb-8 lg:mb-0">
            <Image
              src="/image2.png"
              alt="Easy-to-Use Interface"
              width={600}
              height={400}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </section>
        <section className="text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
            Join Suna Today
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Sign up now and experience the future of physical therapy. Enhance
            patient recovery, streamline your workflow, and achieve better
            outcomes.
          </p>
          <Link href="/sendcondition">
            <p className="text-lg bg-blue-500 text-white rounded-lg px-6 py-3 font-semibold transition duration-300 ease-in-out hover:bg-blue-600">
              Get Started
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
