'use client';

import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
};

export default function StudentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student-tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4">Loading your tasks...</p>;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">🎓 Student Dashboard</h1>

      <div className="overflow-auto">
        <h2 className="text-xl font-semibold mb-2">Your Assigned Tasks</h2>
        <table className="min-w-full border border-gray-300 text-sm rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No tasks assigned yet.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="p-2 border">{task.title}</td>
                  <td className="p-2 border">{task.description}</td>
                  <td className="p-2 border">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
