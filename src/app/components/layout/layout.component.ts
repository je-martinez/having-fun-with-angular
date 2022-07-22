import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { CompressionService } from '../../services/compression.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  componentForm: FormGroup = null as any;
  unsubscribe$ = new Subject<void>();

  constructor(
    private _compressionService: CompressionService,
    private fb: FormBuilder
  ) {}

  private initForm() {
    this.componentForm = this.fb.group({
      myFiles: [],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onChanges() {
    this.componentForm
      ?.get('myFiles')
      ?.valueChanges?.subscribe((files: File) => {
        console.log(files);
      });
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: File[] = Array.from(element.files ?? []);
    if (fileList?.length > 0) {
      const files$ = fileList?.map((item) =>
        this._compressionService.compress(item)
      );
      combineLatest(files$)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          console.log(data);
        });
    }
  }
}
