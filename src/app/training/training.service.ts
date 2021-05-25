import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();

    private availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise?: Exercise | null = null;

    private exercises: Exercise[] = [];

    getAvailableExercise() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(x => x.id === selectedId);
        this.exerciseChanged.next({...this.runningExercise!});
    }

    completeExercise() {
        this.exercises.push({...this.runningExercise!, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise!, 
            date: new Date(), 
            duration: this.runningExercise ? this.runningExercise.duration * progress / 100 : 0,
            calories: this.runningExercise ? this.runningExercise.calories * progress / 100 : 0, 
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return {...this.runningExercise!};
    }

    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}