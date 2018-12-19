import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;

}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  nameParams: string = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const savedTests = JSON.parse(localStorage.getItem('tests'));
    if (savedTests && savedTests.length > 0) {
      this.tests = savedTests;
    } else {
      this.tests = await this.loadTestFromFile();
    }
  }

  async loadTestFromFile() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const newTest: ITest = {
      "id": null,
      "testName": null,
      "pointsPossible": null,
      "pointsReceived": null,
      "percentage": null,
      "grade": null
    };
    this.tests.unshift(newTest);
    //persist into localStorage
    this.saveToLocalStorage('tests', this.tests);
  }

  save(key: string, data: Array<ITest>) {
    this.saveToLocalStorage(key, data);
    this.toastService.showToast('success', 2000, 'Saved Successfully!');
  }

  saveToLocalStorage(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }


  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage('tests', this.tests);
  }

  compute() {

    if (this.nameParams == null || this.nameParams == '') {
      //show error toast
      this.toastService.showToast('warning', 2000, 'Name must be defined!');
    } else if (this.nameParams.indexOf(', ') == -1) {

      this.toastService.showToast('warning', 2000, 'Name must have a comma!');

    } else {
      let pointsPossible = 0;
      let pointsReceived = 0;
      let percentage = 0;
      let grade = '';

      let firstName, lastName, indexOfComma, fullName;

      indexOfComma = this.nameParams.indexOf(', ');
      firstName = this.nameParams.slice(indexOfComma + 1, this.nameParams.length);
      lastName = this.nameParams.slice(0, indexOfComma);
      fullName = firstName + ' ' + lastName;
      for (let i = 0, len = this.tests.length; i < len; i++) {
        const test = this.tests[i];
        pointsPossible += test.pointsPossible;
        pointsReceived += test.pointsReceived;
      }

      percentage = pointsReceived / pointsPossible;
      grade = this.computeGrade(percentage * 100);


      this.router.navigate(['home', {
        pointsPossible: pointsPossible,
        pointsReceived: pointsReceived,
        percentage: percentage,
        fullName: fullName,
        grade: grade
      }]);

      const output = {
        pointsPossible: pointsPossible,
        pointsReceived: pointsReceived,
        percentage: percentage,
        fullName: fullName,
        grade: grade
      };
      this.saveToLocalStorage('output', output);
    }


  }


  computeGrade(percentage: number) {
    let grade = '';
    switch (true) {
      case percentage >= 90:
        grade = 'A';
        break;
      case percentage >= 80:
        grade = 'B';
        break;
      case percentage >= 70:
        grade = 'C';
        break;
      case percentage >= 60:
        grade = 'D';
        break;
      default:
        grade = 'F';
        break;
    }
    return grade;
  }

}
