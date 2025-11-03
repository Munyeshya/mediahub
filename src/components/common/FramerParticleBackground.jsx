// src/components/common/FramerParticleBackground.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Particle = ({ size, position }) => {
    // FASTER SPEED: Duration is between 8s and 15s
    const movementDuration = Math.random() * 7 + 8; // 8s to 15s
    const delay = Math.random() * 10; // 0s to 10s delay

    return (
        <motion.div
            // 💥 INCREASED SOLIDITY: Opacity is now 70% in the class utility
            className="absolute rounded-full bg-amber-500/70 blur-[1px]" // Using your theme color (Amber)
            style={{
                width: size,
                height: size,
                top: `${position.y}%`,
                left: `${position.x}%`,
            }}
            // Framer Motion Animation Properties
            animate={{
                // WIDER DISTANCE: Range is now -50 to +50
                x: [0, Math.random() * 100 - 50, 0], 
                y: [0, Math.random() * 100 - 50, 0],
                // 💥 INCREASED VISIBILITY: Opacity range is now [0.7, 1.0, 0.7] (was [0.5, 0.8, 0.5])
                opacity: [0.7, 1, 0.7], 
            }}
            transition={{
                duration: movementDuration,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: delay,
            }}
        />
    );
};

// Generates an array of particles with random sizes and positions
const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        // 💥 LARGER SIZE: Particle sizes between 2.5px and 4.5px (was 1.5px and 3.5px)
        size: Math.random() * 2 + 2.5, 
        position: {
            x: Math.random() * 100,
            y: Math.random() * 100,
        },
    }));
};

// Main component that wraps the particles
// MORE DOTS: Default particleCount is 150
export function FramerParticleBackground({ particleCount = 150 }) { 
    const particles = React.useMemo(() => generateParticles(particleCount), [particleCount]);

    return (
        // The container must cover the entire screen and be behind the content (z-0)
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <Particle key={p.id} size={p.size} position={p.position} />
            ))}
        </div>
    );
}