import React from 'react';

interface EchoVerseLogoProps {
  className?: string;
}

export default function EchoVerseLogo({ className = "" }: EchoVerseLogoProps) {
  return (
    <svg 
      viewBox="0 0 201 201" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M112 136C83.2812 136 60 112.719 60 84C60 60.6795 75.3514 40.9445 96.5 34.3493" 
        stroke="currentColor"
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path
        d="M75.2422 167.978C90.5676 162.775 105.79 151.026 117.846 136.369C117.982 136.205 118.115 136.038 118.249 135.873C120.85 132.375 123.225 129.24 124.088 128.11C142.858 101.02 150.39 67.151 130.619 45.5898C123.074 37.3622 112.294 32.8666 101.139 33.2945C104.844 32.4617 100.63 32.0222 112.656 32.0222C124.682 32.0222 162.19 43.2507 155.603 72.7302C153.281 83.1249 163.138 89.0719 168.606 97.3357C161.458 101.866 155.334 103.031 159.197 108.207C160.027 109.321 161.113 110.45 162.454 111.593L155.456 114.388C161.513 116.479 160.859 118.797 153.495 121.341C162.553 132.822 157.371 138.179 137.95 137.414C125.64 142.164 118.448 154.999 120.824 167.978H75.2422Z"
        fill="currentColor" 
      />
      <path className="path" d="M99.5 56.5L65 80.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M105 60.5L111 83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M130.5 68.5L89.5 98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M82 46L130 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M79.5 49L87 95.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M67 87L86.5 98.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M113 109L90 100.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M112 86L117.5 105" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M121 130L120 114.5" stroke="currentColor" strokeWidth="2" />
      <path className="path" d="M114 114.5L86 126.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="path" d="M87 102.5L84 124.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M118.5 133L88 148.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" />

      {/* section 1 */}
      <circle className="c10" cx="65.5" cy="126.5" r="4.5" fill="currentColor" />
      <circle className="c9" cx="51" cy="111" r="7" fill="currentColor" />
      <circle className="c8" cx="37" cy="111" r="4" fill="currentColor" />
      <circle className="c7" cx="34.5" cy="98.5" r="3.5" fill="currentColor" />
      <circle className="c6" cx="42" cy="88" r="4" fill="currentColor" />
      <circle className="c5" cx="37.5" cy="77.5" r="3.5" fill="currentColor" />
      <circle className="c4" cx="47.5" cy="67.5" r="5.5" fill="currentColor" />
      <circle className="c3" cx="32.5" cy="66.5" r="3.5" fill="currentColor" />
      <circle className="c2" cx="42.5" cy="55.5" r="3.5" fill="currentColor" />
      <circle className="c1" cx="57" cy="48" r="4" fill="currentColor" />
      
      {/* section 2 */}
      <circle className="lg-middle" cx="88" cy="99" r="7" fill="currentColor" />
      <circle className="lg-circle" cx="103" cy="56" r="9" fill="currentColor" />
      <circle className="lg-circle" cx="118" cy="110" r="9" fill="currentColor" />
      <circle className="lg-middle" cx="83" cy="68" r="5" fill="currentColor" />
      <circle className="lg-middle" cx="120" cy="131" r="5" fill="currentColor" />
      <circle className="lg-middle" cx="131.5" cy="66.5" r="5.5" fill="currentColor" />
      <circle className="lg-edge" cx="111" cy="83" r="6" fill="currentColor" />
      <circle className="lg-middle" cx="84.5" cy="126.5" r="5.5" fill="currentColor" />
      <circle className="lg-edge" cx="80.5" cy="46.5" r="5.5" fill="currentColor" />
      <circle className="lg-circle" cx="62" cy="84" r="9" fill="currentColor" />
    </svg>
  );
}