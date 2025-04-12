'use client';

import { useEffect, useState } from 'react';

type Class = {
  id: string;
  name: string;
  students: {
    student: {
      name: string;
      email: string;
    };
  }[];
};

export default function TeacherClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [studentForm, setStudentForm] = useState<{ [classId: string]: string }>({});

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data.classes);
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return alert('Please enter a class name.');

    const res = await fetch('/api/classes', {
      method: 'POST',
      body: JSON.stringify({ name: newClassName }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setNewClassName('');
      fetchClasses();
    } else {
      const data = await res.json();
      alert(data.error || 'Error creating class');
    }
  };

  const handleDeleteClass = async (id: string) => {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchClasses();
    } else {
      alert('Failed to delete class');
    }
  };

  const handleAddStudent = async (classId: string) => {
    const studentId = studentForm[classId];
    if (!studentId) return alert('Enter student ID');

    const res = await fetch(`/api/classes/${classId}/add-student`, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStudentForm((prev) => ({ ...prev, [classId]: '' }));
      fetchClasses();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to add student');
    }
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold mb-4">🏫 Manage Your Classes</h1>

      {/* Add New Class */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">➕ Create New Class</h2>
        <div className="flex gap-4 items-center">
          <input
            className="border px-3 py-1 rounded w-64"
            placeholder="Class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            onClick={handleCreateClass}
          >
            Create
          </button>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-6">
        {classes.length === 0 ? (
          <p className="text-white-500">No classes yet.</p>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex justify-between items-center mb-2 text-gray-900">
                <h3 className="text-lg font-semibold">{cls.name}</h3>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑 Delete
                </button>
              </div>

              {/* Add student by ID */}
              <div className="mb-4 flex gap-2 items-center text-gray-900">
                <input
                  className="border px-2 py-1 rounded w-64"
                  placeholder="Student ID"
                  value={studentForm[cls.id] || ''}
                  onChange={(e) =>
                    setStudentForm((prev) => ({ ...prev, [cls.id]: e.target.value }))
                  }
                />
                <button
                  onClick={() => handleAddStudent(cls.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add Student
                </button>
              </div>

              {/* List of Students */}
              {cls.students.length === 0 ? (
                <p className="text-sm text-gray-500">No students in this class yet.</p>
              ) : (
                <ul className="text-sm list-disc ml-5 space-y-1">
                  {cls.students.map((s, idx) => (
                    <li key={idx}>
                      {s.student.name} ({s.student.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
