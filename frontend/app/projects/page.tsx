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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then((res: { data: Project[] }) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

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
      
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p>{project.description}</p>
            <p>Category: {project.category}</p>
            <Link href={`/projects/${project.id}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && <p>No projects in this category.</p>}
    </div>
  );
}