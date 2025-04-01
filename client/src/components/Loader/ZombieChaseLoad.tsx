import React from 'react';
import loading from '../../assets/zombie-chase.gif';
import '../../styles/Loading.css';
/**
 * Loading page component that renders a loader
 * @returns {React.ReactNode} Loader
 */
export default function ZombieChaseLoad(): React.ReactNode {
  return (
    <section className="loading-animation">
      <img src={loading} alt="loading animation"/>
    </section>
  );
}