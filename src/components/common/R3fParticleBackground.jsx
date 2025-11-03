// src/components/common/R3fParticleBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Particle Simulation Component ---
const Particles = ({ count }) => {
    const mesh = useRef();

    // Generate random positions for all particles only once
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, [count]);

    // Update positions and rotations on every frame
    useFrame(({ clock }) => {
        const positions = mesh.current.geometry.attributes.position.array;
        const time = clock.getElapsedTime() * 0.1;

        // Apply sine wave movement and rotation
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.005; // X movement
            positions[i + 1] += Math.cos(time + i) * 0.005; // Y movement
            
            // Simple Z (depth) oscillation for a sense of motion
            positions[i + 2] = Math.sin(time + positions[i] * 0.5) * 0.1;
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y = time * 0.1;
        mesh.current.rotation.x = time * 0.05;
    });

    return (
        <points ref={mesh}>
            {/* BufferGeometry holds the position data */}
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* PointsMaterial defines the look of the particles */}
            <pointsMaterial
                size={0.03}
                color="#fcd34d" // Amber 500 theme color
                sizeAttenuation={true} // Particles look smaller further away
                transparent={true}
                opacity={0.8}
            />
        </points>
    );
};

// --- Main Background Component ---
export function R3fParticleBackground() {
    return (
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} >
                {/* 💥 Add Ambient Light to illuminate the scene (optional for points) */}
                <ambientLight intensity={0.5} />
                
                {/* Render the particle field */}
                <Particles count={3000} />
            </Canvas>
        </div>
    );
}