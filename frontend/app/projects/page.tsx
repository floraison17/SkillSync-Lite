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

interface ApiResponse {
  data: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get('/projects', { params: { page, limit: 10 } })
      .then(res => {
        const response = res.data as ApiResponse;
        const projectsData: Project[] = response.data || [];
        const meta = response.meta || { totalPages: 1 };
        
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setTotalPages(meta.totalPages || 1);
        
        const uniqueCategories: string[] = [...new Set(projectsData.map((p: Project) => p.category))];
        setCategories(uniqueCategories);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}