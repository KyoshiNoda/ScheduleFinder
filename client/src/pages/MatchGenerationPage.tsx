import React, { useState } from 'react';
import { GripVertical, Calendar, GraduationCap, Heart, LucideIcon } from 'lucide-react';

interface Priority {
  id: string;
  label: string;
  icon: LucideIcon;
}

const ScheduleMatchPreferences: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const dummyMajors: string[] = [
    'Computer Science',
    'Engineering',
    'Business',
    'Psychology',
    'Biology',
    'Mathematics',
    'Art & Design',
    'Communications'
  ];

  const [priorities, setPriorities] = useState<Priority[]>([
    { id: 'day', label: 'Closest match to this day', icon: Calendar },
    { id: 'majors', label: 'Contains the following majors', icon: GraduationCap },
    { id: 'hobbies', label: 'Hobbies', icon: Heart }
  ]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = (): void => {
    if (draggedItem !== null && dragOverIndex !== null) {
      const newPriorities = [...priorities];
      const [removed] = newPriorities.splice(draggedItem, 1);
      newPriorities.splice(dragOverIndex, 0, removed);
      setPriorities(newPriorities);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleMajorToggle = (major: string): void => {
    setSelectedMajors(prev =>
      prev.includes(major)
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  const getPreviewOrder = (): Priority[] => {
    if (draggedItem === null || dragOverIndex === null) return priorities;
    const preview = [...priorities];
    const [removed] = preview.splice(draggedItem, 1);
    preview.splice(dragOverIndex, 0, removed);
    return preview;
  };

  const previewOrder = getPreviewOrder();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Match Preferences</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Drag to reorder your matching priorities</p>

          <div className="space-y-4">
            {previewOrder.map((priority, index) => {
              const isBeingDragged = draggedItem === priorities.indexOf(priority);
              const isPreview = draggedItem !== null && dragOverIndex !== null && draggedItem !== dragOverIndex;
              const actualIndex = priorities.indexOf(priority);

              return (
                <div
                  key={priority.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white dark:bg-gray-700 border-2 rounded-lg p-6 transition-all duration-200 ${
                    isBeingDragged
                      ? 'opacity-40 border-gray-300 dark:border-gray-600'
                      : isPreview
                        ? 'border-blue-400 dark:border-blue-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                  } cursor-move`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={24} />
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <priority.icon className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded">
                            Priority {index + 1}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{priority.label}</h3>

                        {priority.id === 'day' && (
                          <div className="mt-4">
                            <select
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                              {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {priority.id === 'majors' && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {dummyMajors.map(major => (
                              <label key={major} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedMajors.includes(major)}
                                  onChange={() => handleMajorToggle(major)}
                                  className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{major}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {priority.id === 'hobbies' && (
                          <div className="mt-4">
                            <input
                              type="text"
                              placeholder="Enter hobbies..."
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMatchPreferences;