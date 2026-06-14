'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerId: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage('');
    try {
      await api.post('/applications', { projectId: id });
      setMessage('Application submitted!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const token = localStorage.getItem('access_token');
  let isOwner = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isOwner = project.ownerId === payload.sub;
    } catch (e) {}
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="mb-2">{project.description}</p>
      <p className="mb-2">Category: {project.category}</p>
      {!isOwner && token && (
        <button
          onClick={handleApply}
          disabled={applying}
          className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
        >
          {applying ? 'Applying...' : 'Apply to join'}
        </button>
      )}
      {isOwner && (
        <div className="mt-4 space-x-2">
          <p className="text-gray-500">You are the owner of this project</p>
          <Link href={`/applications/project/${project.id}`} className="bg-purple-500 text-white p-2 rounded inline-block">
            Manage Applications
          </Link>
        </div>
      )}
      {message && <p className="mt-2 text-blue-600">{message}</p>}
    </div>
  );
}