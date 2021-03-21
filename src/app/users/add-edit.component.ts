import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '@app/_services';
import { Parent } from '@app/_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  [x: string]: any;
  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  profileUrl: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaio44lOPveOVpF9fnczhCLTCK3IsJLtIUtg&usqp=CAU';
  parentProfileUrl: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaio44lOPveOVpF9fnczhCLTCK3IsJLtIUtg&usqp=CAU';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    const formOptions: AbstractControlOptions = {};
    this.form = this.formBuilder.group(
      {
        rollNo: ['', Validators.required],
        name: ['', Validators.required],
        age: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        std: ['', Validators.required],
        gender: ['', Validators.required],
        profileUrl: ['', Validators.required],
        parents: this.formBuilder.array([
          this.formBuilder.group({
            parentName: [''],
            parentAge: [''],
            parentEmail: [''],
            parentGender: [''],
            parentProfileUrl: [''],
            relation: [''],
            parentAddress: this.formBuilder.group({
              parentStreet: [''],
              parentState: [''],
              parentCity: [''],
              parentZipCode: [''],
            }),
          }),
        ]),
      },
      formOptions
    );

    if (!this.isAddMode) {
      this.userService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => {
          this.form.patchValue(x);
          this.profileUrl = x.profileUrl;
          x.parents.forEach(parent => { 
           this.addFormControl(parent); 
           this.parentProfileUrl = parent.parentProfileUrl;
            
          })
          console.log(x);
      
        });
    }
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  // Adding new user
  private createUser() {
    this.userService
      .create(this.form.value)
      .pipe(first())
      .subscribe(() => {
        this.alertService.success('User added', { keepAfterRouteChange: true });
        this.router.navigate(['../'], { relativeTo: this.route });
      })
      .add(() => (this.loading = false));
  }

  //updating new user
  private updateUser() {
    this.userService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe(() => {
        this.alertService.success('User updated', {
          keepAfterRouteChange: true,
        });
        this.router.navigate(['../../'], { relativeTo: this.route });
      })
      .add(() => (this.loading = false));
  }

  //for student profile photo form
  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    reader.onload = (_event) => {
      this.profileUrl = reader.result;
      this.form.get('profileUrl')?.patchValue(reader.result);
    };
  }

  //for parent profile photo form
  selectFileParent(event: any, parent:FormGroup) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      //this.parentProfileUrl = reader.result;
      parent.get('parentProfileUrl')?.patchValue(reader.result) 
    };
  }

  // removing parent form
  removeFormControl(i: number) {
    let parentsArray = this.form.controls.parents as FormArray;
    parentsArray.removeAt(i);
  }

  //adding new parent form
  addFormControl(parent?: Parent) {
    let parentsArray = this.form.controls.parents as FormArray;
    let arraylen = parentsArray.length;
    let newUsergroup: FormGroup = this.formBuilder.group({
      parentName: [(parent && parent.parentName) || ''],
      parentAge: [(parent && parent.parentAge) || ''],
      parentEmail: [(parent && parent.parentEmail) || ''],
      parentGender: [(parent && parent.parentGender) || ''],
      parentProfileUrl: [(parent && parent.parentProfileUrl) || ''],
      relation: [(parent && parent.relation) || ''],
      parentAddress: this.formBuilder.group({
        parentStreet: [''],
        parentState: [''],
        parentCity: [''],
        parentZipCode: [''],
      }),
    });
    if(parent.parentAddress){
      newUsergroup.get('parentAddress').patchValue(parent.parentAddress);
    }
    
    parentsArray.insert(arraylen, newUsergroup);
  }
}
