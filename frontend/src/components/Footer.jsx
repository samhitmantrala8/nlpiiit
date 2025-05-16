import img from '../assets/c3.png'

export const Footer = () => {

    const footerStyle = {
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '300px',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
    };

    return (
        <div style={footerStyle} className="px-4 bg-transparent flex flex-col mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-2xl md:px-24 lg:px-8 py-3">
            <div className="grid gap-10 row-gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                    <a
                        href="/"
                        aria-label="Go home"
                        title="Company"
                        className="inline-flex items-center"
                    >
                        <svg
                            className="w-8 text-black"
                            viewBox="0 0 24 24"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            stroke="currentColor"
                            fill="none"
                        >
                            <rect x="3" y="1" width="7" height="12" />
                            <rect x="3" y="17" width="7" height="6" />
                            <rect x="14" y="1" width="7" height="6" />
                            <rect x="14" y="11" width="7" height="12" />
                        </svg>
                        <span className="ml-2 text-xl font-bold tracking-wide text-black">
                            iiitdmChat
                        </span>
                    </a>
                    <div className="mt-6 lg:max-w-sm">
                        <p className="text-[15px] text-black font-semibold">
                            Thank you for visiting our website. Our chatbot is always available to provide you with up-to-date information about IIITDMJ.
                        </p>
                        <p className="mt-4 text-[15px] text-black font-semibold">
                            Feel free to reach out to us for any further assistance or inquiries. Stay connected with IIITDMJ and explore the endless possibilities our institution offers.
                        </p>
                    </div>
                </div>
                <div className="space-y-2 text-md font-semibold text-black">
                    <p className="font-bold text-lg tracking-wide">
                        Developers
                    </p>
                    <div className="flex">
                        {/* <p className="mr-1 text-black">Phone:</p> */}
                        <a
                            href="https://www.linkedin.com/in/samhit-mantrala-1bb517252/"
                            aria-label="Mantrala Samhit"
                            title="Mantrala Samhit"
                            target="_blank"
                            className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-pink-500"
                        >
                            Mantrala Samhit
                        </a>
                    </div>
                    <div className="flex">
                        {/* <p className="mr-1 text-black">Phone:</p> */}
                        <a
                            href="https://www.linkedin.com/in/parthksingh1/"
                            aria-label="Parth K Singh"
                            title="Parth K Singh"
                            target="_blank"
                            className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-pink-500"
                        >
                            Parth K Singh
                        </a>
                    </div>
                    <div className="flex">
                        {/* <p className="mr-1 text-black">Phone:</p> */}
                        <a
                            href="https://www.linkedin.com/in/utkarsh-purohit-7b4b75269/"
                            aria-label="Utkarsh Purohit"
                            title="Utkarsh Purohit"
                            target="_blank"
                            className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-pink-500"
                        >
                            Utkarsh Purohit
                        </a>
                    </div>
                    <div className="flex">
                        {/* <p className="mr-1 text-black">Phone:</p> */}
                        <a
                            href="https://www.linkedin.com/in/ojasva-tomar-baba1826a/"
                            aria-label="Ojasva Tomar"
                            title="Ojasva Tomar"
                            target="_blank"
                            className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-pink-500"
                        >
                            Ojasva Tomar
                        </a>
                    </div>
                </div>
                <div className='flex flex-col pb-3 justify-end'>
                    <span className="text-base font-bold tracking-wide text-gray-900">
                        GitHub Repository
                    </span>
                    <div className="flex items-center mt-1 space-x-3">
                        <a
                            href="https://github.com/samhitmantrala8/prproject"
                            className="text-black transition-colors duration-300 hover:text-deep-purple-accent-400"
                            target="_blank"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-800">
                        Tech Stack : React.js, Flask, Tailwind.css
                    </p>
                </div>
            </div>
            <div className="flex flex-col-reverse gap-6 font-semibold justify-between pt-5 border-t lg:flex-row">
                <p className="text-sm text-gray-900">
                    © Copyright 2024 PR Inc. All rights reserved.
                </p>
                <ul className="flex flex-col space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-900 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            F.A.Q
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-900 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-900 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            Terms &amp; Conditions
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};