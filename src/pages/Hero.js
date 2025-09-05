import React, { useEffect, useState } from "react";

// Layout Component (for structure)
const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <nav>
          {/* Navigation menu */}
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#clients">Clients</a></li>
            <li><a href="#testimony">Testimony</a></li>
            <li><a href="#team">Our Team</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Hero Section
const Hero = () => {
  const images = [
    {
      url: "https://emphires-demo.pbminfotech.com/html-demo/images/service/service-01.jpg",
      title: "Elevate Your Business",
      tagline: "Transform your business with strategic HR solutions.",
    },
    {
      url: "https://emphires-demo.pbminfotech.com/html-demo/images/service/service-02.jpg",
      title: "Empower Your Team",
      tagline: "Build stronger teams through effective HR management.",
    },
    {
      url: "https://emphires-demo.pbminfotech.com/html-demo/images/service/service-03.jpg",
      title: "Optimize Performance",
      tagline: "Maximize employee performance with innovative solutions.",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animateClass, setAnimateClass] = useState("animate");

  const goToNextImage = () => {
    setAnimateClass("");
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setAnimateClass("");
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (animateClass === "") {
      setTimeout(() => setAnimateClass("animate"), 50);
    }
  }, [animateClass]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimateClass("");
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <Layout>
      <style>
        {`
          /* Hero Section Styles */
          .hero-section {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }

          .hero-image {
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: top 1.5s ease-out;
          }

          .hero-image.${animateClass} {
            animation: dropImage 1.5s ease-out forwards;
          }

          .hero-content {
            position: absolute;
            bottom: -100%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: white;
            z-index: 2;
            animation: riseUp 1.5s ease-out forwards 1s;
          }

          .hero-content.${animateClass} {
            animation: riseUp 1.5s ease-out forwards 1s;
          }

          .hero-content h1 {
            font-size: 4rem;
            font-weight: 700;
            letter-spacing: 2px;
          }

          .tagline {
            font-size: 1.75rem;
            font-weight: 500;
            margin-top: 1rem;
          }

          /* Pagination Styles */
          .nav-buttons {
            position: absolute;
            top: 50%;
            left: 10px;
            right: 10px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            z-index: 3;
          }

          .nav-button {
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 12px 20px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 20px;
            transition: background-color 0.3s ease;
          }

          .nav-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
          }

          .nav-button:focus {
            outline: none;
          }

          @keyframes dropImage {
            0% { top: -100%; }
            100% { top: 0; }
          }

          @keyframes riseUp {
            0% { bottom: -100%; }
            100% { bottom: 20%; }
          }

          /* Our Clients Section */
          .clients-section {
            padding: 50px 0;
            background-color: #f5f5f5;
          }

          .client-logo {
            width: 120px;
            height: 60px;
            object-fit: contain;
          }

          .clients-title {
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 30px;
          }

          .client-logos {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: center;
          }

          /* Testimonial Section */
          .testimonial-section {
            padding: 50px 0;
            background-color: #fff;
            text-align: center;
          }

          .testimonial-title {
            font-size: 2.5rem;
            margin-bottom: 30px;
          }

          .testimonial {
            margin: 20px;
            max-width: 500px;
            display: inline-block;
            text-align: center;
          }

          .testimonial p {
            font-style: italic;
            margin-bottom: 20px;
          }

          .testimonial img {
            width: 80px;
            border-radius: 50%;
            margin-bottom: 10px;
          }

          /* Our Team Section */
          .team-section {
            padding: 50px 0;
            background-color: #f5f5f5;
            text-align: center;
          }

          .team-title {
            font-size: 2.5rem;
            margin-bottom: 30px;
          }

          .team-members {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
          }

          .team-member {
            max-width: 250px;
            text-align: center;
          }

          .team-member img {
            width: 100%;
            border-radius: 50%;
            margin-bottom: 10px;
          }

          .team-member h3 {
            margin-bottom: 5px;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="hero-section">
        <img
          src={images[currentImageIndex].url}
          alt="Hero Image"
          className={`hero-image ${animateClass}`}
        />
        <div className={`hero-content ${animateClass}`}>
          <h1>{images[currentImageIndex].title}</h1>
          <p className="tagline">{images[currentImageIndex].tagline}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button className="nav-button" onClick={goToPreviousImage}>
            &#10094; Prev
          </button>
          <button className="nav-button" onClick={goToNextImage}>
            Next &#10095;
          </button>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="clients-section" id="clients">
        <div className="clients-title">Our Clients</div>
        <div className="client-logos">
          <img src="https://via.placeholder.com/150x60?text=Client+1" alt="Client 1" className="client-logo" />
          <img src="https://via.placeholder.com/150x60?text=Client+2" alt="Client 2" className="client-logo" />
          <img src="https://via.placeholder.com/150x60?text=Client+3" alt="Client 3" className="client-logo" />
          <img src="https://via.placeholder.com/150x60?text=Client+4" alt="Client 4" className="client-logo" />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section" id="testimony">
        <div className="testimonial-title">What Our Clients Say</div>
        <div className="testimonial">
          <img src="https://via.placeholder.com/80" alt="Client" />
          <p>"The team at YourCompany was amazing. They helped us scale our business and improve our performance!"</p>
          <h4>John Doe</h4>
          <p>CEO, Company</p>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="team-section" id="team">
        <div className="team-title">Meet Our Team</div>
        <div className="team-members">
          <div className="team-member">
            <img src="https://via.placeholder.com/200" alt="Team Member" />
            <h3>Jane Doe</h3>
            <p>CEO</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/200" alt="Team Member" />
            <h3>John Smith</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/200" alt="Team Member" />
            <h3>Emily White</h3>
            <p>HR Specialist</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Hero;
