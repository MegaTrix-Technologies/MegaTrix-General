# Matrix Core System

The design adopts a mature retro-gaming aesthetic inspired by your pixelated geometric "MT" logos. It utilizes a sophisticated dark color palette (#090A0F deep space background, #0055FF royal electric blue accents, and clean white pixel typography) combined with subtle glowing borders, scanline overlays, and a pixel-dot blinking preloader sequence.

Phase 1: Database Setup (Supabase)
Run this SQL query in your Supabase SQL Editor to create the projects table with optional links support:

SQL
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  tools text[] not null,
  image_url text,
  project_link text,
  github_link text,
  deployed_on text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table projects enable row level security;

-- Allow public read access to projects
allow public read: create policy "Allow public read access" on projects for select using (true);

-- Allow authenticated or admin operations (handled via admin panel password check)
create policy "Allow all write access for admin" on projects for all using (true) with check (true);
Phase 2: Project Structure & Code
1. package.json
JSON
{
  "name": "megatrix-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.300.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0"
  }
}
2. tailwind.config.js
JavaScript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          bg: "#090A0F",
          card: "#12151E",
          border: "#1E2538",
          blue: "#0055FF",
          glow: "#0055FF33",
        },
      },
      fontFamily: {
        mono: ['Courier New', Courier, monospace],
      },
    },
  },
  plugins: [],
};
3. app/globals.css
CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #090A0F;
    color: #F8FAFC;
    font-family: 'Courier New', Courier, monospace;
    overflow-x: hidden;
  }
}

/* Scanline and Retro Grid Overlay */
.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.3)
  );
  background-size: 100% 4px;
}

.retro-grid {
  background-image: linear-gradient(to right, #1e253815 1px, transparent 1px),
                    linear-gradient(to bottom, #1e253815 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #090A0F;
}
::-webkit-scrollbar-thumb {
  background: #1E2538;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #0055FF;
}
4. lib/supabase.ts
TypeScript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
5. components/Preloader.tsx
TypeScript
'use client';
import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 400);

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    


      {/* Pixelated Logo Representation */}
      


        


          {Array.from({ length: 28 }).map((_, i) => {
            // Pattern mimicking the MT pixel grid logo shape
            const isLogoBlock = [
              0,6,7,13,14,20,21,27,     // M left stem & highlights
              8,10,12,16,18,            // M middle structure
              22,23,24,25,26            // T top bar and stem
            ].includes(i % 28);

            return (
              


            );
          })}
        


        
        


          


            MEGATRIX
          


          


            INITIALIZING SYSTEM{'.'.repeat(dots)}
          


        


      


    


  );
}
6. app/page.tsx (Main Public Website)
TypeScript
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Preloader from '@/components/Preloader';
import { Terminal, ExternalLink, Github, Cpu, ShieldCheck, Layers, ArrowRight, Code2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image_url: string;
  project_link?: string;
  github_link?: string;
  deployed_on?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  if (loading) {
    return  setLoading(false)} />;
  }

  return (
    


      {/* Top Navigation Bar */}
      


        


          


            


              MT
            


            
              MEGATRIX
            
          


          
          
            // PROJECTS
            // ARCHITECTURE
            // CONTACT
          

          
            
            ADMIN_LOGIN
          
        


      



      {/* Hero Section */}
      


        


          
          ENTERPRISE SOFTWARE ENGINEERING & ARCHITECTURE
        


        
        


          BUILDING NEXT-GEN DIGITAL SYSTEMS & PLATFORMS
        


        
        


          Megatrix delivers high-performance full-stack applications, secure cloud infrastructure, and custom artificial intelligence pipelines with uncompromising execution.
        



        


          
            EXPLORE WORK
            
          
          
            
            INITIATE PROJECT
          
        


      



      {/* Projects Showcase Section */}
      


        


          


            

// PORTFOLIO ARCHIVE


            

FEATURED DEPLOYMENTS


          


          


            TOTAL SYSTEMS RECORDED: [ {projects.length} ]
          


        



        {projects.length === 0 ? (
          


            
            

No projects uploaded to database yet. Log in to the admin panel to add deployments.


          


        ) : (
          


            {projects.map((project) => (
              


                {project.image_url ? (
                  


                    
                    {project.deployed_on && (
                      
                        {project.deployed_on}
                      
                    )}
                  


                ) : (
                  


                    // NO_IMAGE_PROVIDED
                  


                )}

                


                  


                    


                      {project.title}
                    


                    


                      {project.description}
                    



                    


                      {project.tools?.map((tool, idx) => (
                        
                          {tool}
                        
                      ))}
                    


                  



                  


                    {project.project_link && (
                      
                        
                        LIVE DEMO
                      
                    )}
                    {project.github_link && (
                      
                        
                        SOURCE
                      
                    )}
                  


                


              


            ))}
          


        )}
      



      {/* Architecture Highlights */}
      


        


          

// CORE COMPETENCIES


          

ENGINEERED FOR SCALE


          


            We build robust digital architecture combining retro-futuristic design principles with cutting-edge backend engineering.
          


        



        


          


            
            

Full-Stack Ecosystems


            


              High-performance web applications built using Next.js, React, Node.js, and scalable cloud databases.
            


          



          


            
            

Secure Infrastructure


            


              Hardened authentication mechanisms, role-based access control, and encrypted data pipelines.
            


          



          


            
            

AI & RAG Pipelines


            


              Custom machine learning models, retrieval-augmented generation systems, and automated intelligence integrations.
            


          


        


      



      {/* Footer */}
      


        


          


            


              MT
            


            © 2026 MEGATRIX SOFTWARE HOUSE. ALL RIGHTS RESERVED.
          


          


            Projects
            Architecture
            Admin Portal
          


        


      


    


  );
}
7. app/admin/page.tsx (Secured Admin Dashboard with Hardcoded Login)
TypeScript
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, Lock, Plus, Trash2, ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';

// Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@megatrix.com";
const ADMIN_PASS = "megatrix2026";

interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image_url: string;
  project_link?: string;
  github_link?: string;
  deployed_on?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tools, setTools] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [deployedOn, setDeployedOn] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('megatrix_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('megatrix_admin_auth', 'true');
      setErrorMsg('');
      fetchProjects();
    } else {
      setErrorMsg('ACCESS DENIED: Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('megatrix_admin_auth');
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toolsArray = tools.split(',').map((t) => t.trim()).filter(Boolean);

    const newProject: any = {
      title,
      description,
      tools: toolsArray,
    };

    if (imageUrl) newProject.image_url = imageUrl;
    if (projectLink) newProject.project_link = projectLink;
    if (githubLink) newProject.github_link = githubLink;
    if (deployedOn) newProject.deployed_on = deployedOn;

    const { error } = await supabase.from('projects').insert([newProject]);

    if (!error) {
      setTitle('');
      setDescription('');
      setTools('');
      setImageUrl('');
      setProjectLink('');
      setGithubLink('');
      setDeployedOn('');
      fetchProjects();
    } else {
      alert('Error adding project: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project record?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  if (!isAuthenticated) {
    return (
      


        


          


          
          


            


              
            


            


              

ADMIN PORTAL


              

MEGATRIX SECURITY GATEWAY


            


          



          {errorMsg && (
            


              {errorMsg}
            


          )}

          


            


              ADMIN EMAIL
               setEmail(e.target.value)}
                placeholder="admin@megatrix.com"
                className="w-full bg-[#090A0F] border border-[#1E2538] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0055FF]"
              />
            

            


              PASSWORD
               setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#090A0F] border border-[#1E2538] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0055FF]"
              />
            



            
              AUTHENTICATE
            
          

          


            
              
              RETURN TO PUBLIC WEBSITE
            
          


        
      
    );
  }

  return (
    


      


        {/* Header */}
        


          


            


              
            


            


              

MEGATRIX // COMMAND CENTER


              

LOGGED IN AS: {ADMIN_EMAIL}


            


          


          


            
              
              VIEW SITE
            
            
              
              LOGOUT
            
          


        



        


          {/* Add Project Form */}
          


            


              
              ADD NEW PROJECT
            



            


              


                PROJECT TITLE *
                 setTitle(e.target.value)}
                  placeholder="e.g. AsanShipping SaaS"
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              



              


                DESCRIPTION *
                 setDescription(e.target.value)}
                  placeholder="Detailed project summary..."
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">TOOLS & TECH (COMMA SEPARATED) *</label>
                <input
                  type="text"
                  required
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="Next.js, Tailwind, Supabase"
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">IMAGE URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">LIVE PROJECT LINK (OPTIONAL)</label>
                <input
                  type="url"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="https://megatrix.dev"
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">GITHUB REPO LINK (OPTIONAL)</label>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">DEPLOYED ON (OPTIONAL)</label>
                <input
                  type="text"
                  value={deployedOn}
                  onChange={(e) => setDeployedOn(e.target.value)}
                  placeholder="e.g. Vercel, AWS, Render"
                  className="w-full bg-[#090A0F] border border-[#1E2538] p-2.5 text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0055FF] text-white font-bold tracking-wider hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(0,85,255,0.3)] mt-2"
              >
                {loading ? 'SAVING RECORD...' : 'PUBLISH PROJECT'}
              </button>
            </form>
          </div>

          {/* Project Management List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold mb-4">// EXISTING DATABASE RECORDS ({projects.length})</h2>

            {projects.length === 0 ? (
              <div className="p-8 bg-[#12151E] border border-[#1E2538] text-center text-gray-400">
                No project entries found in Supabase.
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="bg-[#12151E] border border-[#1E2538] p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white">{p.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {p.tools?.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#090A0F] border border-[#1E2538] text-[10px] text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/50 transition-all ml-4"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
How to Run Your Application
Initialize your Next.js project and install dependencies:

Bash
npx create-next-app</body>@latest megatrix-portfolio --typescript --tailwind --app
(Or copy the provided code into your workspace structure)

Install Supabase client and Lucide icons:

Bash
npm install @supabase/supabase-js lucide-react
Create a .env.local file in your root directory with your Supabase keys:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
Navigate to http://localhost:3000 to view the retro-gaming aesthetic preloader and public site, and visit http://localhost:3000/admin to log in with:

Email: admin@megatrix.com

Password: megatrix2026

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/50dc930c-9422-4311-b7c5-a70f8d3d5b8a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
