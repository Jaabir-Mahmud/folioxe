import React from "react";

const features = [
  {
    title: "Portfolio Templates",
    desc: "Stunning, modern templates to showcase your work professionally.",
    icon: (
      <svg className="w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" /></svg>
    )
  },
  {
    title: "Website Themes",
    desc: "Beautifully designed themes for various platforms and needs.",
    icon: (
      <svg className="w-10 h-10 text-purple-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
    )
  },
  {
    title: "Brand Kits",
    desc: "Complete branding packages to kickstart your identity.",
    icon: (
      <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
    )
  }
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 bg-opacity-30 rounded-full filter blur-3xl animate-blob -z-10" style={{animationDelay: '0s'}} />
      <div className="absolute top-20 right-0 w-80 h-80 bg-purple-400 bg-opacity-20 rounded-full filter blur-3xl animate-blob -z-10" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-300 bg-opacity-20 rounded-full filter blur-3xl animate-blob -z-10" style={{animationDelay: '4s'}} />

      {/* Hero Section */}
      <header className="text-center pt-24 pb-16 relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg animate-fadein">
          Discover. Create. <span className="text-blue-600 dark:text-blue-400">Inspire.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-700 dark:text-gray-300 animate-fadein delay-200">
          Welcome to <span className="font-bold text-blue-600 dark:text-blue-400">FolioXe</span> — your one-stop platform to find, share, and sell creative digital assets.
        </p>
        <div className="mt-10 flex justify-center gap-6 animate-fadein delay-300">
          <a
            href="/browse"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg"
          >
            Explore Assets
          </a>
          <a
            href="/signup"
            className="bg-white dark:bg-gray-900 border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg"
          >
            Join as Seller
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="my-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 animate-fadein">What We Offer</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg animate-fadein delay-200">
            Explore a wide range of high-quality digital products.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-t-4 border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-transform duration-300 animate-fadein"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className="flex flex-col items-center">
                {f.icon}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {f.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center my-24 py-16 bg-gradient-to-r from-blue-100 via-white to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900 rounded-3xl shadow-xl max-w-5xl mx-auto animate-fadein">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Create an account today or browse our amazing collection of digital assets.
        </p>
        <div>
          <a
            href="/browse"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
          >
            Explore Assets
          </a>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadein.delay-200 { animation-delay: .2s; }
        .animate-fadein.delay-300 { animation-delay: .3s; }
        @keyframes blob { 0%,100%{transform:translateY(0) scale(1);} 33%{transform:translateY(-20px) scale(1.1);} 66%{transform:translateY(10px) scale(0.95);} }
        .animate-blob { animation: blob 12s infinite ease-in-out; }
      `}</style>

      
    </div>
  );
};

export default HomePage;
