'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Application {
  id: string;
  project: { id: string; title: string };
  status: string;
  createdAt: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 && <p>No applications yet.</p>}
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{app.project.title}</h2>
            <p>
              Status:{' '}
              <span
                className={`font-bold ${
                  app.status === 'ACCEPTED'
                    ? 'text-green-600'
                    : app.status === 'REJECTED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {app.status === 'PENDING'
                  ? 'Pending'
                  : app.status === 'ACCEPTED'
                  ? 'Accepted'
                  : 'Rejected'}
              </span>
            </p>
            <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}