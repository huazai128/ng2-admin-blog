import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgModel } from '@angular/forms';

@Component({
  selector: 'baEChart-checkbox[ngModel]',
  styles: [require('./baCheckbox.scss')],
  template: require('./baCheckbox.html')
})
export class BaCheckbox implements ControlValueAccessor {  //ControlValueAccessor:用于表单组件值得的传递
  @Input() disabled:boolean;
  @Input() label:string;
  @Input() value:string;
  @Input() baCheckboxClass:string;
  @Input() baCheckboxLabelClass:string;

  public model: NgModel;
  public state: boolean;

  public constructor(@Self() state:NgModel) {
    this.model = state;
    state.valueAccessor = this;
  }

  public onChange(value: any): void {}
  public onTouch(value: any): void {}
  //
  public writeValue(state: any): void {
    console.log(state,"变化了");//
    this.state = state;
  }

  public registerOnChange(fn: any): void {
    this.onChange = function(state: boolean) {
      this.writeValue(state);
      this.model.viewToModelUpdate(state);
    }
  }
  public registerOnTouched(fn: any): void { this.onTouch = fn; }
}
