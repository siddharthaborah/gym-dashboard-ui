import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Dumbbell, CheckCircle, Plus, X } from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
}

interface Workout {
  id: number;
  name: string;
  assigned: string[];
  exercises: Exercise[];
  completed: string[];
}

const initialWorkouts: Workout[] = [
  {
    id: 1,
    name: "Full Body Workout",
    assigned: ["John Doe"],
    exercises: [
      { id: 1, name: "Squats", sets: 3, reps: 12 }
    ],
    completed: []
  }
];

const GymDashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentWorkoutId, setCurrentWorkoutId] = useState<number | null>(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 0,
    reps: 0
  });

  // Add new workout
  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) return;

    const newWorkout: Workout = {
      id: workouts.length + 1,
      name: newWorkoutName,
      assigned: [],
      exercises: [],
      completed: []
    };

    setWorkouts([...workouts, newWorkout]);
    setNewWorkoutName('');
    setShowNewWorkoutForm(false);
  };

  // Add new exercise to workout
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.name || newExercise.sets <= 0 || newExercise.reps <= 0) return;

    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout => {
        if (workout.id === currentWorkoutId) {
          return {
            ...workout,
            exercises: [...workout.exercises, {
              id: workout.exercises.length + 1,
              ...newExercise
            }]
          };
        }
        return workout;
      })
    );

    setNewExercise({ name: '', sets: 0, reps: 0 });
    setShowExerciseForm(false);
  };

  // Remove exercise
  const handleRemoveExercise = (workoutId: number, exerciseId: number) => {
    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
          };
        }
        return workout;
      })
    );
  };

  // Add member to workout
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedWorkout) return;

    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => {
        if (workout.id === parseInt(selectedWorkout)) {
          return {
            ...workout,
            assigned: [...workout.assigned, newMemberName]
          };
        }
        return workout;
      })
    );

    setNewMemberName('');
    setSelectedWorkout('');
  };

  // Remove member
  const handleRemoveMember = (workoutId: number, memberName: string) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            assigned: workout.assigned.filter(name => name !== memberName),
            completed: workout.completed.filter(name => name !== memberName)
          };
        }
        return workout;
      })
    );
  };

  // Toggle completion
  const handleToggleCompletion = (workoutId: number, memberName: string) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => {
        if (workout.id === workoutId) {
          const isCompleted = workout.completed.includes(memberName);
          return {
            ...workout,
            completed: isCompleted
              ? workout.completed.filter(name => name !== memberName)
              : [...workout.completed, memberName]
          };
        }
        return workout;
      })
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gym Monitoring Dashboard</h1>
        <button
          onClick={() => setShowNewWorkoutForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Plus size={20} /> New Workout
        </button>
      </div>

      {/* New Workout Form */}
      {showNewWorkoutForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleAddWorkout} className="flex gap-4 pt-4">
              <input
                type="text"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                placeholder="Enter workout name"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create Workout
              </button>
              <button
                type="button"
                onClick={() => setShowNewWorkoutForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Member Form */}
      <Card className="mb-6">
        <CardContent>
          <form onSubmit={handleAddMember} className="flex gap-4 pt-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="flex-1 px-3 py-2 border rounded"
            />
            <select
              value={selectedWorkout}
              onChange={(e) => setSelectedWorkout(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="">Select Workout</option>
              {workouts.map(workout => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={20} /> Add Member
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Exercise Form */}
      {showExerciseForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleAddExercise} className="space-y-4 pt-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                  placeholder="Exercise name"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({...newExercise, sets: Number(e.target.value)})}
                  placeholder="Sets"
                  className="w-24 px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({...newExercise, reps: Number(e.target.value)})}
                  placeholder="Reps"
                  className="w-24 px-3 py-2 border rounded"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setShowExerciseForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Active Workouts</p>
              <p className="text-2xl font-bold">{workouts.length}</p>
            </div>
            <Dumbbell className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-bold">
                {new Set(workouts.flatMap(w => w.assigned)).size}
              </p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold">
                {new Set(workouts.flatMap(w => w.completed)).size}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-2xl font-bold">
                {workouts.filter(w => w.assigned.length > w.completed.length).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Workouts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map(workout => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {workout.name}
                <button
                  onClick={() => {
                    setCurrentWorkoutId(workout.id);
                    setShowExerciseForm(true);
                  }}
                  className="flex items-center gap-2 text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus size={16} /> Add Exercise
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Exercises:</h3>
                  <ul className="space-y-2">
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{exercise.name}: {exercise.sets} sets x {exercise.reps} reps</span>
                        <button
                          onClick={() => handleRemoveExercise(workout.id, exercise.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Members:</h3>
                  <div className="flex flex-wrap gap-2">
                    {workout.assigned.map((person, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                        <span className="text-sm text-blue-800">{person}</span>
                        <button
                          onClick={() => handleRemoveMember(workout.id, person)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleCompletion(workout.id, person)}
                          className={`ml-1 ${workout.completed.includes(person) ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GymDashboard;