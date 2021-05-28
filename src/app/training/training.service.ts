import { Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { Exercise } from "./exercise.model";
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from "@angular/core";
import { UiService } from "../shared/ui.service";
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UiService,
        private store: Store<fromTraining.State>
    ) { }

    fetchAvailableExercise() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
            .pipe(
                map(result => {
                    return result.map(doc => {
                        const data = <Exercise>doc.payload.doc.data();
                        data.id = doc.payload.doc.id;
                        return data;
                    });
                })
            ).subscribe(exercises => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            },
                error => {
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar('Fatching exercises failed, please try again later', 3000);
                }));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({ ...ex!, date: new Date(), state: 'completed' });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex!,
                date: new Date(),
                duration: ex ? ex.duration * progress / 100 : 0,
                calories: ex ? ex.calories * progress / 100 : 0,
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    fetchCompletedOrCancelledExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe(exercises => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetFinishedTrainings(<Exercise[]>exercises));
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(element => {
            element.unsubscribe();
        });
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}