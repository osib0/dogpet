'use client'
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const FeatureItem = ({ title, description, children }: any) => (
    <div className="p-5 bg-white rounded-2xl shadow transition-all duration-300 h-full flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-3 text-[14px]">{description}</p>
        </div>
        <div>{children}</div>
    </div>
);

const AnimatedLine = ({ pathId, pathD }: any) => {
    useEffect(() => {
        gsap.to(`#${pathId} rect`, {
            motionPath: {
                path: `#${pathId} path`,
                align: `#${pathId} path`,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
            },
            duration: 3,
            repeat: -1,
            ease: 'none',
        });
    }, [pathId]);

    return (
        <svg
            id={pathId}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="38"
            viewBox="0 0 153 48"
            fill="none"
            className="overflow-visible"
        >
            <path
                d={pathD}
                stroke="#72e3ad"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_6px_#72e3ad]"
            />
            <rect
                transform="translate(-10, -0.5)"
                fill="#72e3ad"
                width="10"
                height="2"
                rx="1"
            />
        </svg>
    );
};

const Hexagon = () => (
    <div className="relative w-24 h-24 flex items-center justify-center">
        <svg viewBox="0 0 170 188" className="absolute inset-0">
            <path
                d="M97.3728 4.15852C89.7925 -0.217983 80.4531 -0.217983 72.8728 4.15852L13.6449 38.3538C6.0646 42.7303 1.39493 50.8184 1.39493 59.5714V127.962C1.39493 136.715 6.0646 144.803 13.6449 149.179L72.8728 183.375C80.4531 187.751 89.7925 187.751 97.3728 183.375L156.601 149.179C164.181 144.803 168.851 136.715 168.851 127.962V59.5714C168.851 50.8184 164.181 42.7303 156.601 38.3538L97.3728 4.15852Z"
                stroke="#72e3ad"
                strokeWidth="2"
                fill="transparent"
                className="drop-shadow-[0_0_8px_#72e3ad]"
            />
        </svg>
    </div>
);

export default function TrustSection() {
    return (
        <section className="container mx-auto p-10">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-2xl lg:text-4xl font-semibold text-gray-900">
                    Why Pet Parents Trust{" "}
                    <span className="text-[#72e3ad]">DogPet Clinic</span>
                </h2>

                <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">
                    We combine expert veterinary care with compassion, safety, and
                    modern facilities to give your pets the best treatment possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Left */}
                <FeatureItem
                    title="Trusted by Pet Parents"
                    description="Loved and trusted by hundreds of dog & pet owners for compassionate care."
                >
                    <div className="flex flex-col items-center gap-3">
                        <AnimatedLine pathId="lineUp" pathD="M0 46C40 40 90 20 150 2" />
                        <Hexagon />
                        <AnimatedLine pathId="lineDown" pathD="M0 2C40 10 90 30 150 46" />
                    </div>
                </FeatureItem>

                {/* Middle */}
                <div className="flex flex-col gap-2">
                    <FeatureItem
                        title="Certified Veterinary Doctors"
                        description="Experienced and licensed vets providing safe and expert treatments."
                    >
                        <AnimatedLine pathId="lineMid1" pathD="M1 24C50 20 100 20 150 24" />
                    </FeatureItem>

                    <FeatureItem
                        title="24/7 Emergency Support"
                        description="We are available round-the-clock for urgent pet care needs."
                    >
                        <AnimatedLine pathId="lineMid2" pathD="M1 24C50 20 100 20 150 24" />
                    </FeatureItem>
                </div>

                {/* Right */}
                <FeatureItem
                    title="Modern & Hygienic Clinic"
                    description="Advanced equipment with a clean, pet-friendly environment."
                >
                    <div className="flex flex-col items-center gap-3">
                        <AnimatedLine pathId="lineUp2" pathD="M0 46C40 40 90 20 150 2" />
                        <Hexagon />
                        <AnimatedLine pathId="lineDown2" pathD="M0 2C40 10 90 30 150 46" />
                    </div>
                </FeatureItem>
            </div>
        </section>
    );
}
