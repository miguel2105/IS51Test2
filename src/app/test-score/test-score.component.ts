import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';


@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<any> = [];
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {

  }


  addTest() {
    this.tests = [{
      "id": 1,
      "testName": "Test 1",
      "pointsPossible": 100,
      "pointsReceived": 80,
      "percentage": 0.8,
      "grade": "B"
    },
    {
      "id": 2,
      "testName": "Test 2",
      "pointsPossible": 100,
      "pointsReceived": 70,
      "percentage": 0.7,
      "grade": "C"
    },
    {
      "id": 3,
      "testName": "Final Exam",
      "pointsPossible": 250,
      "pointsReceived": 200,
      "percentage": 0.8,
      "grade": "B"
    }
  ]
  }
}
