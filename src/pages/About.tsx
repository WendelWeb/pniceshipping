const About = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Content Section */}
      <div className="w-full md:w-1/2 flex items-center p-6 md:p-16 bg-gray-50">
        <div className="max-w-xl">
          <p className="text-blue-600 font-medium mb-4 flex items-center">
            <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
            SHIPPING A WORLD OF POSSIBILITY
          </p>
          
          <div className="relative mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-[url('/api/placeholder/800/200')] bg-cover bg-center bg-no-repeat">
              Seamless Air
              <br /> 
              Transport
            </h1>
            {/* Overlay to ensure text remains readable */}
            <h1 className="absolute inset-0 text-4xl md:text-6xl font-bold text-black/10">
              Seamless Air
              <br /> 
              Transport
            </h1>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Experience dependable, efficient air freight solutions tailored to your needs. Pnice shipping, we ensure timely, secure global cargo delivery.
          </p>
          
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors flex items-center group">
            Track Your Package
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 h-[300px] md:h-screen relative">
        <img 
          src="./hero-plane.png" 
          alt="Commercial aircraft with ground support vehicle" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
    </div>
  );
};

export default About;
