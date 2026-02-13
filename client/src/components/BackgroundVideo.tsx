import { useEffect, useState } from 'react';
import bg1 from '../assets/bg1.png';

import bgvdo from '../assets/bgvdo.mp4';

export default function BackgroundVideo() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-luxury-black">
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" />

            {/* Base Image Background (Mobile Fallback) */}
            {isMobile ? (
                <div className="absolute inset-0 w-full h-full z-0">
                    <img
                        src={bg1}
                        alt="Luxury Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
            ) : (
                /* Local Video Layer (Desktop) */
                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transform scale-105"
                    >
                        <source src={bgvdo} type="video/mp4" />
                    </video>
                </div>
            )}
        </div>
    );
}
