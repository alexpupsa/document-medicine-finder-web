import { Directive, EventEmitter, HostBinding, HostListener, Output } from "@angular/core";

@Directive({
  selector: '[fileDragDrop]'
})

export class FileDragNDropDirective {
  @Output() private filesChangeEmiter: EventEmitter<File> = new EventEmitter();

  @HostBinding('style.background') private background = '#eee';
  @HostBinding('style.border') private borderStyle = '2px dashed';
  @HostBinding('style.border-color') private borderColor = '#673ab7';
  @HostBinding('style.border-radius') private borderRadius = '5px';

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'lightgray';
    this.borderColor = 'cadetblue';
    this.borderStyle = '3px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#673ab7';
    this.borderStyle = '2px dashed';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#673ab7';
    this.borderStyle = '2px dashed';
    let files = evt.dataTransfer.files;
    let validFiles: Array<File> = files;
    if (validFiles.length > 0 && validFiles[0].name.endsWith(".pdf")) {
      this.filesChangeEmiter.emit(validFiles[0]);
    }
  }
}