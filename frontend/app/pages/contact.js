"use client";
import { Mail, Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#1b1b1b] text-white px-6">
      {/* Titre */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6">
        Contact
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">
        Si vous souhaitez me contacter, envoyez-moi un message sur mes réseaux :
      </p>

      {/* Boutons */}
      <div className="flex gap-6">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/duncan-miard-722568334"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] rounded-xl hover:scale-105 transition-transform"
        >
          <Linkedin className="w-6 h-6" />
          <span className="font-semibold">LinkedIn</span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/SirKalany"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-[#24292f] rounded-xl hover:scale-105 transition-transform"
        >
          <Github className="w-6 h-6" />
          <span className="font-semibold">GitHub</span>
        </a>

        {/* Email */}
        <a
          href="mailto:duncan.miard@outlook.fr"
          className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl hover:scale-105 transition-transform"
        >
          <Mail className="w-6 h-6" />
          <span className="font-semibold">Email</span>
        </a>
      </div>
    </main>
  );
}
