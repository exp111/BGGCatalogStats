import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ViewerPlay, ViewerPlayer} from "../../../../model/viewer";

type viewerPlayType = Record<(keyof ViewerPlay), undefined>;
const viewerPlayObj: viewerPlayType = {
  Game: undefined,
  GameId: undefined,
  Players: undefined,
  Data: undefined,
  Id: undefined,
  Duration: undefined,
  Won: undefined,
  Notes: undefined,
  Timestamp: undefined,
  Location: undefined
};

type viewerPlayerType = Record<(keyof ViewerPlayer), undefined>;
const viewerPlayerObj: viewerPlayerType = {
  Roles: undefined,
  Name: undefined,
  IsMe: undefined
};


@Component({
  selector: 'app-viewer-doc-modal',
  imports: [],
  templateUrl: './viewer-doc-modal.component.html',
  styleUrl: './viewer-doc-modal.component.scss'
})
export class ViewerDocModalComponent {
  viewerPlayObj = viewerPlayObj;
  VIEWER_PLAY = Object.keys(viewerPlayObj) as (keyof ViewerPlay)[];
  VIEWER_PLAYER = Object.keys(viewerPlayerObj) as (keyof ViewerPlayer)[];

  constructor(protected activeModal: NgbActiveModal) {
    (window as any).filterDoc = this;
  }
}
