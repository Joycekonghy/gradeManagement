'use client';

import { useEffect, useState } from 'react';

type Student = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: {
    name: string;
    email: string;
  };
};

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Record<string, { title: string; description: string; dueDate: string }>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; description: string; dueDate: string }>({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data.students));
  }, []);

  useEffect(() => {
    fetch('/api/teacher-tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks));
  }, []);

  const handleChange = (id: string, field: 'title' | 'description' | 'dueDate', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAssign = async (studentId: string) => {
    const form = formData[studentId];
    if (!form?.title || !form?.description || !form?.dueDate)
      return alert('Please fill in all fields');

    const res = await fetch('/api/assign-task', {
      method: 'POST',
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        studentId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Task assigned!');
      setFormData((prev) => ({ ...prev, [studentId]: { title: '', description: '', dueDate: '' } }));
      refreshTasks();
    } else {
      alert('Error assigning task');
    }
  };

  const handleDelete = async (taskId: string) => {
    const res = await fetch(`/api/teacher-tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) {
      refreshTasks();
    } else {
      alert('Failed to delete task');
    }
  };

  const handleUpdate = async (taskId: string) => {
    const res = await fetch(`/api/teacher-tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      alert('Task updated!');
      setEditingTaskId(null);
      refreshTasks();
    } else {
      alert('Update failed');
    }
  };

  const refreshTasks = async () => {
    const res = await fetch('/api/teacher-tasks');
    const data = await res.json();
    setTasks(data.tasks);
  };

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📚 Teacher Dashboard</h1>

      {/* Assign New Task */}
      <div className="overflow-auto">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Assign New Tasks</h2>
        <table className="min-w-full border border-gray-300 rounded-md text-sm bg-white text-gray-900">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Assign</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-2 border">{student.email}</td>
                <td className="p-2 border">{student.name}</td>
                <td className="p-2 border">{student.role}</td>
                <td className="p-2 border">
                  <input
                    className="border px-2 py-1 w-full"
                    value={formData[student.id]?.title || ''}
                    onChange={(e) => handleChange(student.id, 'title', e.target.value)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    className="border px-2 py-1 w-full"
                    value={formData[student.id]?.description || ''}
                    onChange={(e) => handleChange(student.id, 'description', e.target.value)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="date"
                    className="border px-2 py-1 w-full"
                    value={formData[student.id]?.dueDate || ''}
                    onChange={(e) => handleChange(student.id, 'dueDate', e.target.value)}
                  />
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleAssign(student.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assigned Tasks */}
      <div className="overflow-auto">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">📋 Tasks You&apos;ve Assigned</h2>
        <table className="min-w-full border border-gray-300 rounded-md text-sm bg-white text-gray-900">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No tasks assigned yet.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="p-2 border">{task.assignedTo.name}</td>
                  <td className="p-2 border">{task.assignedTo.email}</td>

                  {editingTaskId === task.id ? (
                    <>
                      <td className="p-2 border">
                        <input
                          className="border px-2 py-1 w-full"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          className="border px-2 py-1 w-full"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="date"
                          className="border px-2 py-1 w-full"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                        />
                      </td>
                      <td className="p-2 border space-x-2 text-center">
                        <button onClick={() => handleUpdate(task.id)} className="text-green-600 hover:underline">
                          ✅ Save
                        </button>
                        <button onClick={() => setEditingTaskId(null)} className="text-gray-600 hover:underline">
                          ❌ Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 border">{task.title}</td>
                      <td className="p-2 border">{task.description}</td>
                      <td className="p-2 border">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="p-2 border space-x-2 text-center">
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditForm({
                              title: task.title,
                              description: task.description,
                              dueDate: task.dueDate.slice(0, 10),
                            });
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:underline"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
