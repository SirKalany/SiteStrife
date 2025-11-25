"use client";
import { Mail, Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#121212] text-white px-6 py-12 tracking-tight flex flex-col items-center justify-center font-mono">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className={`text-5xl font-extrabold mb-3 bg-yellow-500 uppercase tracking-[0.2em]`}
        >
          CONTACT
        </h1>
        <div className="w-28 h-0.5 mx-auto bg-yellow-500 mt-2 skew-x-12" />
        <p className="mx-auto text-center text-gray-400 text-sm uppercase mt-4 tracking-widest">
          Reach me through any of the channels below
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 mt-6">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/duncan-miard-722568334"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div
            className="relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 hover:shadow-[0_0_15px_#c9b45840]"
            style={{
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
            }}
          >
            <div className="p-6 transform -skew-x-4 flex items-center gap-4">
              <Linkedin className="w-8 h-8 text-[#0A66C2]" />
              <h3
                className={`text-xl font-bold bg-yellow-500 group-hover:text-yellow-400 transform skew-x-4`}
              >
                LinkedIn
              </h3>
            </div>
          </div>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/SirKalany"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div
            className="relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 hover:shadow-[0_0_15px_#c9b45840]"
            style={{
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
            }}
          >
            <div className="p-6 transform -skew-x-4 flex items-center gap-4">
              <Github className="w-8 h-8" />
              <h3
                className={`text-xl font-bold bg-yellow-500 group-hover:text-yellow-400 transform skew-x-4`}
              >
                GitHub
              </h3>
            </div>
          </div>
        </a>

        {/* Mail */}
        <a href="mailto:duncan.miard@outlook.fr" className="group block">
          <div
            className="relative overflow-hidden bg-[#1e1e1e] border border-gray-700 rounded-sm transition-all duration-200 hover:border-yellow-500/80 hover:shadow-[0_0_15px_#c9b45840]"
            style={{
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
            }}
          >
            <div className="p-6 transform -skew-x-4 flex items-center gap-4">
              <Mail className="w-8 h-8 text-green-500" />
              <h3
                className={`text-xl font-bold bg-yellow-500 group-hover:text-yellow-400 transform skew-x-4`}
              >
                Email
              </h3>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
