
import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date('October 18, 2025 18:00:00').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;
    
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }

    return timeLeft;
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  const timerComponents = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 text-tpahla-darkgreen">Countdown to the Awards Ceremony</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {timerComponents.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-tpahla-darkgreen">
              <div className="text-3xl md:text-5xl font-bold text-tpahla-gold">
                {item.value < 10 ? `0${item.value}` : item.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium mt-2">{item.label}</div>
            </div>
          ))}
        </div>
        
        <p className="text-center mt-8 text-gray-600 max-w-lg mx-auto">
          Join us on October 18, 2025 at the Abuja Continental Hotel, Nigeria for the prestigious Pan-African Humanitarian Leadership Awards ceremony.
        </p>
      </div>
    </section>
  );
};

export default CountdownTimer;
