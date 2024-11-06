import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css', './app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'cvAppStateManagementPractice';
  formGroup!: FormGroup;
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      schoolInputs: new FormArray([]),
    });

    this.subscribeToSchoolInputArray();
    this.subscribeToPersonalInfoFields();
  }

  get getSchoolInputArray(): FormArray {
    return this.formGroup.get('schoolInputs') as FormArray;
  }

  subscribeToPersonalInfoFields() {
    this.getLatestValuesOfPersonalInfoFields().subscribe((value)=>{
      console.log(value);
    })
  }

  getLatestValuesOfPersonalInfoFields() {
    const latestPersonalInfoFields = combineLatest([
      this.formGroup.get('name')?.valueChanges.pipe(startWith('')),
      this.formGroup.get('email')?.valueChanges.pipe(startWith('')),
    ]);
    return latestPersonalInfoFields;
  }

  subscribeToSchoolInputArray() {
    const schoolInputsArray = this.formGroup.get('schoolInputs') as FormArray;
    schoolInputsArray.controls.forEach((control) => {
      control.valueChanges.subscribe((value) => {
        console.log('FormArray control value changed:', value);
      });
    });
  }

  addNewSchoolInputField() {
    const schoolInputsArray = this.formGroup.get('schoolInputs') as FormArray;
    schoolInputsArray.push(this.newSchoolInputFormControl());
    this.subscribeToSchoolInputArray();
  }

  newSchoolInputFormControl(): FormGroup {
    const schoolInputsArray = this.formGroup.get('schoolInputs') as FormArray;
    return new FormGroup({
      schoolName: new FormControl('', Validators.required),
      gpa: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(4),
      ]),
      id: new FormControl(schoolInputsArray.length),
    });
  }

  onDeleteSchoolInputField(index: number) {
    const schoolInputsArray = this.formGroup.get('schoolInputs') as FormArray;
    schoolInputsArray.removeAt(index);
    this.subscribeToSchoolInputArray();
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
