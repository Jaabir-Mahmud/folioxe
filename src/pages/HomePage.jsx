const HomePage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-4 bg-white dark:bg-black text-black dark:text-white">
  DARK MODE TEST: Should change color
</div>

      <header className="text-center my-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600 dark:text-blue-400">FolioXe</span>!
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Your one-stop platform to discover and showcase amazing portfolios, themes, and creative assets.
        </p>
      </header>

      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            What We Offer
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Explore a wide range of high-quality digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Portfolio Templates</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Stunning, modern templates to showcase your work professionally.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Website Themes</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Beautifully designed themes for various platforms and needs.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Brand Kits</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Complete branding packages to kickstart your identity.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center my-16 py-12 bg-gray-50 dark:bg-gray-700 rounded-lg"> {/* Adjusted dark bg for section contrast */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Create an account today or browse our amazing collection of digital assets.
          </p>
          <div>
            <a
              href="#explore" // Replace with actual link later e.g. /browse or /signup
              className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Explore Assets
            </a>
          </div>
      </section>
    </div>
  );
};

export default HomePage;