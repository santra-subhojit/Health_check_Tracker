import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressChartComponent } from './progress-chart.component';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ChartService } from '@/app/services/chart/chart.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  workouts: any[];
  totalWorkouts: number;
  totalMinutes: number;
}

describe('ProgressChartComponent', () => {
  let component: ProgressChartComponent;
  let fixture: ComponentFixture<ProgressChartComponent>;
  let chartServiceMock: jasmine.SpyObj<ChartService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const chartServiceSpy = jasmine.createSpyObj('ChartService', [
      'createChart',
      'updateChart',
    ]);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatListModule, ProgressChartComponent],
      providers: [
        { provide: ChartService, useValue: chartServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressChartComponent);
    component = fixture.componentInstance;
    chartServiceMock = TestBed.inject(ChartService) as jasmine.SpyObj<ChartService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

    component.chartRef = new ElementRef(document.createElement('canvas'));

    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [],
        totalWorkouts: 0,
        totalMinutes: 0,
      },
    ];

    spyOn(component, 'loadUsers').and.callFake(() => {
      component.users = mockUsers;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users on ngOnInit', () => {
    component.ngOnInit();
    expect(component.loadUsers).toHaveBeenCalled();
    expect(component.users?.length).toBe(1);
    expect(component.users?.[0].name).toBe('John Doe');
  });

  it('should initialize chart on ngAfterViewInit', () => {
    spyOn(component, 'initializeChart');
    component.ngAfterViewInit();
    expect(component.initializeChart).toHaveBeenCalled();
  });

  it('should load users from localStorage', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [],
        totalWorkouts: 0,
        totalMinutes: 0,
      },
    ];
    localStorage.setItem('workoutData', JSON.stringify(mockUsers));
    component.loadUsers();
    expect(component.users?.length).toBe(1);
    expect(component.users?.[0].name).toBe('John Doe');
  });

  it('should select user and update chart', () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      workouts: [],
      totalWorkouts: 0,
      totalMinutes: 0,
    };
    component.onSelectUser(user);
    expect(component.selectedUser).toBe(user);
    expect(chartServiceMock.updateChart).toHaveBeenCalledWith(user);
  });
});
