'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Application {
  id: string;
  user: { name: string; email: string };
  status: string;
  createdAt: string;
}

export default function ProjectApplicationsPage() {
  const { projectId } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = () => {
    api.get(`/applications/project/${projectId}`)
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const updateStatus = async (appId: string, status: string) => {
    try {
      await api.patch(`/applications/${appId}`, { status });
      fetchApplications();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Applications for Project</h1>
      {applications.length === 0 && <p>No applications yet.</p>}
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="border p-4 rounded">
            <p><strong>{app.user.name}</strong> ({app.user.email})</p>
            <p>Status: {app.status === 'PENDING' ? 'Pending' : app.status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}</p>
            <div className="mt-2 space-x-2">
              {app.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateStatus(app.id, 'ACCEPTED')}
                    className="bg-green-500 text-white p-1 rounded px-3"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, 'REJECTED')}
                    className="bg-red-500 text-white p-1 rounded px-3"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}