import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Products from './components/Products.jsx';
import Contact from './components/Contact.jsx';
import { About, Footer, Genetics, Marquee, Mission, Why } from './components/Sections.jsx';

export default function App() {
  const [topic, setTopic] = useState(null);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Mission />
        <Genetics onEnquire={setTopic} />
        <Products onEnquire={setTopic} />
        <Why />
        <Contact topic={topic} />
      </main>
      <Footer />
    </>
  );
}
