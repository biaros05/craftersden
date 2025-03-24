import React from 'react';
import loading from '../../assets/creeper.gif';
import '../../styles/Loading.css';
/**
 * Loading page component that renders a loader
 * @returns {React.ReactNode} Loader
 */
export default function CreeperLoad(): React.ReactNode {
  return (
    <section className="loading-animation">
      <img className="creeper" src={loading} alt="loading animation"/>
    </section>
  );
}