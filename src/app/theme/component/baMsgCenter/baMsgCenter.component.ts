import { Component } from "@angular/core";
import { BaMsgCenterService } from "./baMsgCenter.service";

@Component({
  selector:"ba-msg-center",
  styles:[require("./baMsgCenter.scss")],
  template:require("./baMsgCenter.html"),
  providers:[BaMsgCenterService]
})

export class BaMsgCenter{
  public notifications:Array<Object>;
  public messages:Array<Object>;
  constructor(private service:BaMsgCenterService){}

  ngOnInit(){
    this.notifications = this.service.getNotifications();
    this.messages = this.service.getMessages();
  }
}
