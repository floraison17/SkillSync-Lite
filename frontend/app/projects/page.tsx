'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerId: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <div className="flex gap-4 mb-4">
        <Link href="/projects/create" className="bg-green-500 text-white p-2 rounded inline-block">
          Create New Project
        </Link>
        <Link href="/applications/my" className="bg-blue-500 text-white p-2 rounded inline-block">
          My Applications
        </Link>
      </div>
      <div className="grid gap-4">
        {projects.map(project => (
          <div key={project.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p>{project.description}</p>
            <p>Category: {project.category}</p>
            <Link href={`/projects/${project.id}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}