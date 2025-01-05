import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUploadSelectionComponent } from './base-upload-selection.component';

describe('BaseUploadSelectionComponent', () => {
  let component: BaseUploadSelectionComponent;
  let fixture: ComponentFixture<BaseUploadSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseUploadSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseUploadSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
